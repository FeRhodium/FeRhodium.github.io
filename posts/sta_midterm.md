---
title: 二项分布及其简单扩展
summary: "Statistics Knowledge"
created: "2025-03-13T16:49:59+08:00"
updated: "2025-03-16T16:29:59+08:00"
tags:
  - easy
---

我们说一个 RV $X$ 遵循二项分布是指

> 在 $n$ 次成功概率为 $p$ 独立伯努利试验中，成功次数为 $x$。

<!-- more -->

记作 $X \sim B(n, p)$。其 pmf

$$
f(x) = \binom nx p^x(1 - p)^{n - x}
$$

mgf

$$
M(t) = \sum_{x = 0}^n e^{tx}\binom nx p^x (1 - p)^{n - x} = (1 - p + pe^t)^n
$$

which can comfirm that

$$
M'(t) = npe^t(1 - p + pe^t)^{n - 1},\newline M''(t) = n(n - 1)p^2 e^{2t}(1 - p + p e^t)^{n - 2} + npe^t(1 - p + pe^t)^{n - 1}
$$
$$
\mu = M'(0) = np, \newline\sigma^2 = M''(0) - M'^2(0) = np(p(n - 1)) + np - (np)^2 = np(1 - p)
$$

当 $n \to \infty, p \to 0$, 记 $\lambda = np$ 即均值，可被描述为

> 将某时间段均分为 $n$ 个单位时间段，某事件在该单位时间段发生的概率为 $p$，事件在该时间段发生次数的均值即为 $\lambda$。

若 RV $X$ 表示时间段上事件发生的次数，我们称 $X$ 遵循 Possion Distrubution，记作 $X \sim \text{Poisson}(\lambda)$。其 pmf

$$
\begin{aligned}
f(x) &= \lim_{n \to \infty} \frac{n!}{x!(n - x)!} \left(\frac\lambda n\right)^x \left(1 - \frac\lambda n\right)^{n - x} \newline &= \frac{\lambda^x}{x!} \lim_{n \to \infty} \frac{n!}{ n^x(n - x)!} \lim_{n \to \infty} \left(1 - \frac\lambda n\right)^{n - x} \newline &= \frac{\lambda^x e^{-\lambda}}{x!}
\end{aligned}
$$

mgf

$$
\begin{aligned}
M(t) &= \sum_{x \ge 0} e^{tx}\frac{\lambda^x e^{-\lambda}}{x!} \newline &=  e^{-\lambda}\sum_{x \ge 0} \frac{\left(\lambda e^t\right)^x}{x!} \newline &= e^{\lambda\left(e^t - 1\right)}
\end{aligned}
$$

均值和方差均为 $\lambda$ obviously。

我们继续考察观察到（observe）Possion Distrubution 事件第一次的出现时间 $X$，这意味着 RV $X$ 是连续的。考察其 cdf

$$
F(x) = P(X \ge x) = 1 - P(X \le x) = 1 - e^{-\lambda x}
$$

其中第三个等号表示事件在时间段 $[0, x]$ 从未发生。则 RV $X$ 的 pdf

$$
f(x) = F'(x) = \lambda e^{-\lambda x}
$$

记 $\theta = \lambda^{-1}$ 为 Exponential Distribution 的参数，被描述为单位时间内事件的发生率，则 RV $X$ 遵循 Exponential Distribution 意味着其 pmf

$$
f(x) = \frac 1 \theta e^{-\frac x\theta}
$$

更进一步的，如果我们考察观察到 Possion Distrubution 发生 $\alpha$ 次的第一次出现时间 $X$，考察其 cdf

$$
F(x) = P(X \ge x) = 1 - \sum_{k = 0}^{\alpha - 1} \frac{(\lambda x)^k e^{-\lambda x}}{k!}
$$

pdf

$$
\begin{aligned}
f(x) &= F'(x) = \lambda e^{-\lambda x} - e^{-\lambda x}\sum_{k = 1}^{\alpha - 1}\left(\frac{k(\lambda x)^{k - 1} \lambda}{k!} - \frac{(\lambda x)^{k} \lambda}{k!}\right) \newline &= \lambda e^{-\lambda x} - e^{-\lambda x}\left(\lambda - \frac{(\lambda x)^{\alpha - 1} \lambda}{(\alpha - 1)!}\right) = e^{-\lambda x} \lambda^{\alpha} \frac{x^{\alpha - 1}}{(\alpha - 1)!}
\end{aligned}
$$

这样的 RV 被称为遵循 Erlang Distribution，要求 $\alpha$ 为正整数，其 cdf 由上文给出。

如果将 $\alpha$ 扩展到实数域，则要将阶乘扩展到实数域，记实数域上的函数 $\Gamma(x)$ 满足

$$
\int_0^{\infty} e^{-\lambda x} \lambda^{\alpha} \frac{x^{\alpha - 1}}{\Gamma(\alpha)} \text{d} x = 1
$$

意味着

$$
\Gamma(\alpha) = \int_0^{\infty} e^{-\lambda x} (\lambda x)^{\alpha - 1} \text{d} \lambda x = \int_0^{\infty} e^{-y} y^{\alpha - 1} \text{d} y
$$

这给出了 Gamma 函数的定义，据此我们说 $X$ 遵循 Gamma Distribution，是指其 pdf

$$
f(x) = e^{-\frac x \theta} \theta^{-\alpha} x^{\alpha - 1} \Gamma^{-1}(\alpha)
$$

其中 $\theta, \alpha$ 为参数，定义由上文给出。

其 mgf

$$
\begin{aligned}
M(t) &= \Gamma^{-1}(\alpha) \theta^{-\alpha} \int_0^{\infty} e^{x(t - \theta^{-1})} x^{\alpha - 1} \text{d} x  \newline &= \left(\theta^{-1} - t\right)^{-\alpha}\theta^{-\alpha} \Gamma^{-1}(\alpha)\int_0^{\infty} e^{-(\theta^{-1} - t)x} \left(\left(\theta^{-1} - t\right)x\right)^{\alpha - 1} \text{d} \left(\left(\theta^{-1} - t\right)x\right) \newline &= (1 - \theta t)^{-\alpha}
\end{aligned}
$$

其均值和方差 $\mu = \alpha \theta$, $\sigma^2 = \alpha \theta ^2$。不难验证 Exponential Distribution 是 $\alpha = 1$ 的 Gamma Distribution。

特别的，我们能够注意到，两个遵循同一发生率的 Gamma Distribution 的 RV，其代数和应当也会遵循 Gamma Distribution，其发生次数应当为二者之和，形式化的

> 对于 $X_1 \sim \Gamma(\alpha_1, \theta), X_2 \sim \Gamma(\alpha_2, \theta)$，$X_1 + X_2 \sim \Gamma(\alpha_1 + \alpha_2, \theta)$

这一性质一般被描述为 Gamma Distribution 的可加性，接下来来证明这一性质。

令 $Z = X_1 + X_2$，其 pdf

$$
\begin{aligned}
f(z) &= \int_{-\infty}^{\infty} f_1(x)f_2(z - x) \text d x \newline
&= \theta^{-(\alpha_1 + \alpha_2)} \Gamma^{-1}(\alpha_1)\Gamma^{-1}(\alpha_2) e^{-\frac z\theta} \int_{0}^{z} x^{\alpha_1 - 1}(z - x)^{\alpha_2 - 1} \text d x \newline
&=  e^{-\frac z\theta} z^{\alpha_1 + \alpha_2 - 1} \theta^{-(\alpha_1 + \alpha_2)} \color{cyan}{\Gamma^{-1}(\alpha_1)\Gamma^{-1}(\alpha_2)\int_{0}^{1} t^{\alpha_1 - 1}(1 - t)^{\alpha_2 - 1} \text d t}
\end{aligned}
$$

第三个等号换元 $t = \frac xz$，将 Cyan 色部分设为 $A$，则有

$$
\begin{aligned}
1 &= \int_0^{\infty} A \theta^{-(\alpha_1 + \alpha_2)} e^{-\frac z\theta} z^{\alpha_1 + \alpha_2 - 1} \text d z \newline
&= A \int_0^{\infty} e^{-\frac z\theta} \left(\frac z\theta\right)^{\alpha_1 + \alpha_2 - 1} \text d \frac z\theta \newline
&= A\Gamma(\alpha_1 + \alpha_2) \implies A = \Gamma^{-1}(\alpha_1 + \alpha_2)
\end{aligned}
$$

代回原式

$$
f(z) = e^{-\frac z\theta} \theta^{-(\alpha_1 + \alpha_2)}z^{\alpha_1 + \alpha_2 - 1} \Gamma^{-1}(\alpha_1 + \alpha_2)
$$

也即 $X_1 + X_2 = Z \sim \Gamma(\alpha_1 + \alpha_2, \theta)$

---

让我们回到一切的起点，对于遵循二项分布 $B(n, p)$ 的随机变量 $Z$，当 $n \to \infty$，令 $X = \frac{Z - \mu}{\sigma} = \frac{Z - np}{\sqrt{np(1 - p)}}$，其 pmf

$$
P(Z = k) = \lim_{n \to \infty}\binom nk p^k(1 - p)^{n - k}
$$
利用斯特林公式，并取对数

$$
\ln P(Z = k)= \lim_{n\to \infty} n \ln n + k \ln p + (n - k) \ln(1 - p) - \frac 12 \ln (2\pi k(n - k)) - k \ln k - (n - k)\ln (n - k)
$$

其中 $k = np + x \sigma$，则 $\frac{x \sigma}{np} \to 0$，$\frac{x \sigma}{n(1 - p)} \to 0$ 当 $n \to \infty$，二者同在 $O(n^{-0.5})$，意味着我们只需展开到泰勒 $x^2$ 项。

$$
\begin{aligned}
&= \lim_{n\to \infty} n \ln n + k \ln p + (n - k) \ln(1 - p) + \frac 12 n - \frac 12 \ln (2\pi k(n - k)) - k \ln np - (n - k) \ln(n(1 - p)) - \frac{kx \sigma}{np} + \frac{k x^2 \sigma^2}{2n^2p^2} + \frac{(n - k)x \sigma}{n(1 - p)} + \frac{(n - k)x^2 \sigma^2}{2n^2(1 - p)^2} \newline
& = \lim_{n\to \infty} \frac 12 \ln n - \frac 12 \ln (2\pi (np + x\sigma)(n - np - x\sigma)) - \frac{kx(1 - p) - (n - k)xp}{\sigma} + \frac{kx^2(1 - p)^2 + (n - k)x^2 p^2}{2\sigma^2} \newline
& = \lim_{n\to \infty} \frac 12 \ln n - \frac 12 \ln\left(2\pi n^2p(1 - p)\left(1 + \frac{x\sigma}{np}\right)\left(1 - \frac{x\sigma}{n(1 - p)}\right)\right) - x^2 + \frac{x^2}2 + o(x^3) \newline
& = -\frac 12 \ln(2\pi np(1 - p)) - \frac{x^2}2
\end{aligned}
$$

还原对数可得

$$
P(Z = k) = \frac{e^{-\frac{x^2}{2}}}{\sqrt{2\pi np(1 - p)}}
$$

也即导出了正态分布 $Z\sim \mathcal N(np, np(1 - p))$ 的 pdf，也即说明了 $X\sim \mathcal N(0, 1)$。

更一般的，我们说 RV $X\sim \mathcal N(\mu, \sigma^2)$，是指它的 pdf

$$
f(x) = \frac {1}{\sqrt{2\pi \sigma^2}} \exp\left(-\frac{(x - \mu)^2}{\sigma^2}\right)
$$

当 $\mu = 0, \sigma^2 = 1$ 时，我们说 $X$ 遵循标准正态分布。其 cdf

$$
\Phi(x) = \int_{-\infty}^x \frac {1}{\sqrt{2\pi}}\exp\left(-\frac{x^2}{2}\right) \text{d} x
$$

更进一步的，如果 $k$ 个 RV $X_i \sim \mathcal N(0, 1)$，考虑 $Z = \sum X_i^2$。

 先考虑 $k = 1$ 的情况，也即

 $$
 \begin{aligned}
 f(z) &= \frac{\text{d}}{\text{d} z}P(|X| \le \sqrt z) \newline &= \frac{\text{d} \sqrt{z}}{\text{d} z} \frac{\text d}{\text d \sqrt z}\int_{-\sqrt z}^{\sqrt z} \frac{1}{\sqrt{2\pi}} e^{-\frac{x^2}2} \text d x \newline &= \frac{1}{2\sqrt z} \times \frac{2}{\sqrt{2\pi}} e^{-\frac z2} = \frac{(\frac 12)^{\frac 12}}{\Gamma(\frac 12)} z^{\frac 12 - 1} e^{-\frac z2}
 \end{aligned}
 $$

所以说 $z$ 遵循 $\theta = 2, \alpha = \frac 12$ 的 Gamma Distribution。而根据 Gamma Distribution 的可加性，不难得出 $Z \sim \Gamma(2, \frac k2)$。我们将这样的 RV 称作其遵循 Chi-Square Distribution，记作 $Z \sim \chi^2(k)$，其中 $k$ 为参数，被称作自由度。

以上。