---
title: 梯形法则的简单证明
katex: true
---

在初等微积分教材中，谈及数值积分时应当会谈论到梯形法则的误差但不给出其证明，这里给出一种简单证明。

> **Theorem: Error Estimates in _The Trapezoidal Rule_**
> > **The Trapezoidal Rule**
> > 
> > To approxmate $\displaystyle\int_a^b f(x) \text{d}x$, use
> > $$ T = \frac{b - a}{2n}\left(f\left(x_0\right) + f\left(x_n\right) +\sum_{i = 1}^{n - 1}2f\left(x_i\right)\right) $$
> > when $x_0 = a$, $x_i = x_{i - 1} + \dfrac{b - a}{n}(1\le i\le n)$.
> 
> The error $E_T$ of _The Trapezoidal Rule_ satisfies
> $$ \left|E_T\right| = \left|\int_a^b f(x) \text{d} x - T\right|\le \frac{M(b - a)^3}{12n^2} $$
> when $M = \displaystyle\max_{a\le x\le b}\left|f''(x)\right|$.

梯度法则通过近似每个区间梯形面积进而近似整个积分，平凡的想法也即通过对每一个区间的误差求和即得到总误差，即对于每个 $i\in[1, n]$, 希望计算

$$
\int_{x_{i - 1}}^{x_i} f(x) \text dx - \frac{(f(x_i) + f(x_{i - 1}))(b - a)}{2n}
$$

应当注意到的是，不等式右侧与二阶导有关，则可以通过两次分部积分法使出现 $f''$，并使得**误差仅与其相关**，记 $h = \dfrac{b - a}{n}$，则

$$
\int_{x_{i - 1}}^{x_{i - 1}+h}f(x) \text dx = \left[(x + A)f(x) - \left(\frac{(x + A)^2}2 + B\right)f'(x)\right]_{x_{i - 1}}^{x_{i - 1}+h} + \int_{x_{i - 1}}^{x_{i - 1}+h}\left(\frac{(x + A)^2}2 + B\right)f''(x) \text dx
$$

其中 $A$, $B$ 为任意常数。要使得**误差仅与二阶导相关**，也即

$$
(x_{i - 1} + h + A)f(x_{i - 1} + h) - (x_{i - 1} + A)f(x_{i - 1}) = \frac{(f(x_{i - 1} + h) + f(x_{i - 1}))h}{2}
$$

比较常数可知，$x_i + h + A = -x_{i - 1} - A \implies A = -\dfrac h2 - x_{i - 1}$，此时等式恰好成立。

同时，

$$
\left(\frac{(x_{i - 1} + A)^2}2 + B\right)f'(x_{i - 1}) = \left(\frac{(x_{i - 1} + h + A)^2}2 + B\right)f'(x_{i - 1} + h)
$$

成立，不难得出 $B = -\dfrac {h^2}8$

综上，当 $(A, B) = \left(-\dfrac h2 - x_{i - 1}, -\dfrac {h^2}{8}\right)$ 时，

$$
\begin{aligned}
\left|E_T\right| &= \left|\sum_{i = 1}^n \int_{x_{i - 1}}^{x_{i - 1}+h}\left(\frac{(x + A)^2}2 + B\right)f''(x) \text dx\right|\\
&= \left|\int_{0}^{h}\left(\frac{(t - h/2)^2}2 -\frac{h^2}8\right)\sum_{i = 1}^nf''(t + x_{i - 1}) \text dt\right|\\
&\le \int_{0}^{h}\left(\frac{h^2}8 - \frac{(t - h/2)^2}2\right)\sum_{i = 1}^n\left|f''(t + x_{i - 1})\right| \text dt\\
&\le nM \left[\frac{h^2t}8 - \frac{(t - h/2)^3}6\right]_0^h\\
&=\frac{M(b - a)^3}{12n^2} \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \square
\end{aligned}
$$

上述放缩过程中，我们直接分别取绝对值再直接取最大值，放缩是极为粗糙的。

以上
