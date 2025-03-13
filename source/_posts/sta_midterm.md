---
title: 二项分布及其简单扩展
mathjax: true
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
M'(t) = npe^t(1 - p + pe^t)^{n - 1}, M''(t) = n(n - 1)p^2 e^{2t}(1 - p + p e^t)^{n - 2} + npe^t(1 - p + pe^t)^{n - 1} \\

\mu = M'(0) = np, \sigma^2 = M''(0) - M'^2(0) = np(p(n - 1)) + np - (np)^2 = np(1 - p)
$$

当 $n \to \infty, p \to 0$, 记 $\lambda = np$ 即均值，可被描述为

> 将某时间段均分为 $n$ 个单位时间段，某事件在该单位时间段发生的概率为 $p$，事件在该时间段发生次数的均值即为 $\lambda$。

若 RV $X$ 表示时间段上事件发生的次数，我们称 $X$ 遵循 Possion Distrubution，记作 $X \sim \text{Poisson}(\lambda)$。其 pmf

$$
f(x) = \lim_{n \to oo} \frac{n!}{x!(n - x)!} \left(\frac\lambda n\right)^x \left(1 - \frac\lambda n\right)^{n - x} = \frac{\lambda^x}{x!} \lim_{n \to oo} \frac{n!}{ n^x(n - x)!} \lim_{n \to oo} \left(1 - \frac\lambda n\right)^{n - x} = \frac{\lambda^x e^{-\lambda}}{x!}
$$

mgf

$$
M(t) = \sum_{x \ge 0} e^{tx}\frac{\lambda^x e^{-\lambda}}{x!} =  e^{-\lambda}\sum_{x \ge 0} \frac{\left(\lambda e^t\right)^x}{x!} = e^{\lambda\left(e^t - 1\right)}
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
f(x) = F'(x) = \lambda e^{-\lambda x} - e^{-\lambda x}\sum_{k = 1}^{\alpha - 1}\left(\frac{k(\lambda x)^{k - 1} \lambda}{k!} - \frac{(\lambda x)^{k} \lambda}{k!}\right) = \lambda e^{-\lambda x} - e^{-\lambda x}\left(\lambda - \frac{(\lambda x)^{\alpha - 1} \lambda}{(\alpha - 1)!}\right) = e^{-\lambda x} \lambda^{\alpha} \frac{x^{\alpha - 1}}{(\alpha - 1)!}
$$

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
M(t) = \Gamma^{-1}(\alpha) \theta^{-\alpha} \int_0^{\infty} e^{x(t - \theta^{-1})} x^{\alpha - 1} \text{d} x =  \left(\theta^{-1} - t\right)^{-\alpha}\theta^{-\alpha} \Gamma^{-1}(\alpha)\int_0^{\infty} e^{-(\theta^{-1} - t)x} \left(\left(\theta^{-1} - t\right)x\right)^{\alpha - 1} \text{d} \left(\left(\theta^{-1} - t\right)x\right) = (1 - \theta t)^{-\alpha}
$$

其均值和方差 $\mu = \alpha \theta$, $\sigma^2 = \alpha \theta ^2$。不难验证 Exponential Distribution 是 $\alpha = 1$ 的 Gamma Distribution。
