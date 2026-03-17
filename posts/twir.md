---
title: Pauli Twirling：从小学二年级学起
summary: "Noise tailoring"
tags:
  - easy
  - quantum
---
量子计算中，$I, X, Y, Z$ 作为最基础的四种 Pauli 算符，作用在单量子比特上噪声较小，因此我们将这四种构成一组 Pauli 基，研究其他 Cifford 门（通常是 CNOT、CZ）的噪声。

$$
X = \begin{bmatrix}
0 & 1 \\
1 & 0
\end{bmatrix},

Y = \begin{bmatrix}
0 & -i \\
i & 0
\end{bmatrix},

Z = \begin{bmatrix}
1 & 0 \\
0 & -1
\end{bmatrix}
$$

:::note{title="Clifford 门"}

**定义**

我们说一个门 $U$ 是 Clifford 的，是指对于任意 Pauli $P \in \mathcal P_n$，都有

$$
U P U^\dagger\in \mathcal P_n
$$

:::

当量子门的噪声在 Pauli 基上相干时，噪声的累积使电路最终的噪声难以分析；Pauli Twirling 则提出了一个方法，使相干的噪声尽量趋于形似随机翻转、随机相位的噪声。形式化的，

:::note{title="Pauli Transfer Matrix"}

**定义**

在 $n$ 比特系统上，对于量子电路 $\Lambda$，它的 Pauli Transfer Matrix $R_{\Lambda}$ 描述了 $\mathcal P_n$ 中 Pauli 算符在通过该电路后在 $\mathcal P_n$ 各个算符的分量

$$
\Lambda(P_j) = \sum_i (R_\Lambda)_{ij} P_i
$$

:::

Pauli 算符是自反正交的，也即

$$
P_i P_j = \begin{cases}
0 & i \neq j\\
I_{2^n} &i = j
\end{cases}
$$

证明是显然的；据于此，在 $R_\Lambda$ 定义式两边左乘任一 Pauli 算符，有

$$
P_i \Lambda(P_j) = \sum_k (R_\Lambda)_{kj} P_i P_k
$$

也即

$$
P_i \Lambda(P_j) = (R_\Lambda)_{ij} I_{2^n}
$$

两边取迹可得

$$
\boxed{
  (R_\Lambda)_{ij} = \frac{1}{2^n} \text{Tr}[P_i \Lambda(P_j)]
}
$$

通过 $R_\Lambda$，我们可以定量分析噪声引入对 Pauli 基的相干程度。