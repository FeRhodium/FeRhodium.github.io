---
title: Pauli Twilrling：从小学二年级学起
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

$$ U P U^\dagger\in \mathcal P_n $$

:::