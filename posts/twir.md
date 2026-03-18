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

:::note{title="Pauli Transfer Matrix(PTM)"}

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

通过 $R_\Lambda$，我们可以定量分析噪声引入对 Pauli 基相干程度的影响。

具体来说，噪声通道 PTM 的对角项反映了噪声对某个 Pauli 基的影响，非对角项反映了噪声引入后导致的 Pauli 基相互影响；Pauli Twirling 则通过在高噪声量子门前后添加纯 Pauli 门使噪声通道 PTM 只保留对角项。形式上的，令理想量子电路为 $\mathcal U$，实际硬件上电路后存在噪声通道 $\Lambda$，对实际电路 Twirling 即为

$$
\mathcal U_{T} = \mathcal C_{T^c} \circ \Lambda \circ \mathcal U \circ \mathcal C_{T} \text{ where } \mathcal C_Q(\rho) = Q\rho Q
$$

其中 $T \in \mathcal P_n$，根据 Clifford 的门的定义，$T^c \in \mathcal P_n$ 满足

$$
U T = T^c U \implies T^c = U T U^\dagger
$$

从而有

$$
U \circ \mathcal C_T = \mathcal C_{T^c} \circ U
$$

因此

$$
\boxed{
\mathcal U_T = \mathcal C_{T^c} \circ \Lambda \circ \mathcal C_{T^c} \circ \mathcal U
}
$$

这意味着，我们在实际电路前后添加 Pauli 门不会改变电路的逻辑，只会对噪声通道产生影响。形式化的，对于 Pauli 基上的任一算符 $P_j$，Twirling 后的通道取每一个 Pauli 基的算数平均，也即

$$
\begin{aligned}
\mathcal T (\Lambda)(P_j) &= \frac{1}{4^n} \sum_{Q} Q\Lambda(QP_j Q) Q = \frac{1}{4^n} \sum_{Q} Q \sum_i s_{Qj} (R_\Lambda)_{ij} P_i Q \\ &= \frac{1}{4^n} \sum_Q \sum_i s_{Qi}s_{Qj} (R_\Lambda)_{ij} P_i = \frac{1}{4^n} \sum_i (R_\Lambda)_{ij} P_i \sum_Q s_{Qi}s_{Qj} 
\end{aligned}
$$

其中 $s_{Qi} = \pm 1$ 满足

$$
Q P_i Q = s_{Qi} P_i, \frac{1}{4^n}\sum_Q s_{Qi}s_{Qj} = \delta_{ij}
$$

证明是平凡的。

因此，

$$
\boxed{
\mathcal T (\Lambda)(P_i) = (R_{\Lambda}) P_i \implies R_{\mathcal T(\Lambda)} = \text{diag}(R_{11}, R_{22}, \cdots)
}
$$

所以，在 Twirling 后，噪声不会导致 Pauli 基之间的误差累积，而仅作用于某一 Pauli 基上。

