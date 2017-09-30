---
layout: post
title: 常用排序算法
tags: arithmetic
date: 2017-09-30 12:25:00 +800
---

排序(Sorting) 是计算机程序设计中的一种重要操作，它的功能是将一个数据元素(或记录)的任意序列，重新排列成一个关键字有序的序列。

衡量排序算法的两个指标，时间复杂度和稳定性。

举个例子，如果我们的数据是：`3 5 4 2 2`, 稳定的排序最后的俩个2在排好序后他们的原始前后顺序是不会变的，不稳定的排序最后两个2的顺序可能交换。

常见排序算法时间复杂度和稳定性：

![](http://img.my.csdn.net/uploads/201207/19/1342700879_2982.jpg)

时间复杂度曲线：

![](http://img.my.csdn.net/uploads/201207/21/1342856655_3698.jpg)

## 冒泡排序

冒泡排序是將比較大的數字移到序列的后面，较小的移到前面。

![](https://sfault-image.b0.upaiyun.com/558/388/558388586-57314c386acf8_articlex)

### 步骤

1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。在这一点，最后的元素应该会是最大的数。
3. 针对所有的元素重复以上的步骤，除了最后一个。
4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

### 实例

原始数据：

`3 5 2 6 2`

第一轮

比较 3 和 5，5 大于 3 ，不需交换  

`3 5 2 6 2`  

继续比较 5 和 2，5 大于 2，交换位置  

`3 2 5 6 2`  

继续比较 5 和 6，6 大于 5，不需交换  

`3 2 5 6 2`  

继续比较 6 和 2，6 大于 2，交换位置  

`3 2 5 2 6`  

6 移到最后，两个2都分别向前移动。

第二轮

比较 3 和 2， 3 大于 2，交换位置  

`2 3 5 2 6`  

比较 3 和 5， 5 大于 3，不需交换  

`2 3 5 2 6`  

比较 5 和 2， 5 大于 2，交换位置  

`2 3 2 5 6`  

不需比较 5 和 6

第三轮

比较 2 和 3， 3 大于 2，不需交换  

`2 3 2 5 6`  

比较 3 和 2， 3 大于 2，交换位置  

`2 2 3 5 6`  

不需比较了  

第四轮

比较 2 和 2，不需交换  

`2 2 3 5 6`

四轮结束

`2 2 3 5 6`

### 实现

```java
public class Bubble {

    /**
     * 冒泡排序
     * 
     * @param array
     * @return
     */
    public static int[] sort(int[] array) {
        int temp;
        // 第一层循环表明比较的轮数, 比如 length 个元素,比较轮数为 length-1 次（不需和自己比）
        for (int i = 0; i < array.length - 1; i++) {
            System.out.println("第" + (i + 1) + "轮开始");
            // 第二层循环，每相邻的两个比较一次，次数随着轮数的增加不断减少，每轮确定一个最大的，不需比较那个最大的
            for (int j = 0; j < array.length - 1 - i; j++) {
                System.out.println("第" + (i + 1) + "轮，第" + (j + 1) + "次比较：");
                if (array[j + 1] < array[j]) {
                    temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
                for (int k : array) {
                    System.out.print(k + " ");
                }
                System.out.println();
            }
            System.out.println("结果：");
            for (int k : array) {
                System.out.print(k + " ");
            }
            System.out.println();
        }
        return array;
    }

    public static void main(String[] args) {
        int[] array = { 3, 5, 2, 6, 2 };
        int[] sorted = sort(array);
        System.out.println("最终结果");
        for (int i : sorted) {
            System.out.print(i + " ");
        }
    }

}
```

## 快速排序

快速排序，通过一趟排序将待排记录分割成独立的两部分，其中一部分记录的关键字均比另一部分的关键字小，然后分别对这两部分记录继续进行排序,以达到整个序列有序的目的。

![](https://sfault-image.b0.upaiyun.com/406/973/4069737006-55edbb217175a_articlex)

### 步骤

1. 选择一个基准元素，通常选择第一个元素或者最后一个元素
2. 通过一趟排序将待排序的记录分割成独立的两部分，其中一部分记录的元素值均比基准元素值小。另一部分记录的元素值均比基准值大
3. 此时基准元素在其排好序后的正确位置
4. 然后分别对这两部分记录用同样的方法继续进行排序，直到整个序列有序。

### 实例

原始数据：

`3 5 2 6 2`

选择 3 作为基准

第一轮

从右往左找比3小的，最后一个2符合，将2和3对调  

`2 5 2 6 3`  

对调一次，查找的方向反向，从左向右找比3大的，5符合，对调  

`2 3 2 6 5`  

再从右往左找比3小的，2符合，对调  

`2 2 3 6 5`  

一轮结束

第二轮

对 `[2 2]` 采用同上的方式进行，得到  

`2 2 3 6 5`  

第三轮

对 `[6 5]` 采用同上的方式进行，得到  

`2 2 3 5 6`  

最终结果

`2 2 3 5 6`

快排是不稳定的排序，如上面原始的两个2的前后顺序发生了变化。

### 实现

```java
public class Quick {

    private static int mark = 0;

    /**
     * 快排序
     * 
     * @param array
     * @return
     */
    public static int[] sort(int[] array) {
        return quickSort(array, 0, array.length - 1);
    }

    /**
     * 辅助交换方法
     * 
     * @param array
     * @param a
     * @param b
     */
    private static void swap(int[] array, int a, int b) {
        if (a != b) {
            int temp = array[a];
            array[a] = array[b];
            array[b] = temp;
            // 找到符合的，对调
            System.out.println("对调" + array[a] + "与" + array[b] + ",得到");
            for (int i : array) {
                System.out.print(i + " ");
            }
            System.out.println();
        }
    }

    /**
     * 新一轮分隔
     * 
     * @param array
     * @param low
     * @param high
     * @return
     */
    private static int partition(int array[], int low, int high) {
        int base = array[low];
        mark++;
        System.out.println("正在进行第" + mark + "轮分隔，区域：" + low + "-" + high);
        while (low < high) {
            while (low < high && array[high] >= base) {
                high--;
                System.out.println("从右往左找比" + base + "小的，指针变动：" + low + "-" + high);
            }
            swap(array, low, high);
            while (low < high && array[low] <= base) {
                low++;
                System.out.println("从左往右找比" + base + "大的，指针变动：" + low + "-" + high);
            }
            swap(array, low, high);
        }
        return low;
    }

    /**
     * 对数组进行快速排序，递归调用
     * 
     * @param array
     * @param low
     * @param heigh
     * @return
     */
    private static int[] quickSort(int[] array, int low, int high) {
        if (low < high) {
            int division = partition(array, low, high);
            quickSort(array, low, division - 1);
            quickSort(array, division + 1, high);
        }
        return array;
    }

    public static void main(String[] args) {
        int[] array = { 3, 5, 2, 6, 2 };
        int[] sorted = sort(array);
        System.out.println("最终结果");
        for (int i : sorted) {
            System.out.print(i + " ");
        }
    }

}
```

## 直接插入排序

插入排序是一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

### 步骤

1. 从第一个元素开始，该元素可以认为已经被排序
2. 取出下一个元素，在已经排序的元素序列中从后向前扫描
3. 如果该元素（已排序）大于新元素，将该元素移到下一位置
4. 重复步骤3，直到找到已排序的元素小于或者等于新元素的位置
5. 将新元素插入到该位置之后
6. 重复步骤2，直到排好序为止

### 实例

原始数据：

`3 5 2 6 2`

第一轮，把 3 作为已经排好序的，取出 5 与 3 进行比较，5 大于 3 位置保持不变，新的有序组为 `[3 5]`

`3 5 2 6 2`

第二轮，取出第一个 2 ，从已排序的 `[3 5]` 数组从后往前比较，与 5 比较，小于 5，将 5 向后移动一个位置，再与 3 比较，小于 3，将 3 向后移动一个位置，前面没有了，将 2 放置在原来 3 的位置，新的有序组为 `[2 3 5]`

`2 3 5 6 2`

第三轮，取出 6 ，与 5 比较，5 保持不动，新的有序组 `[2 3 5 6]`

`2 3 5 6 2`

第四轮，取出 2 ，与 6 比较，6 向后移动一位，与 5 比较，5 向后移动一位，与 3 比较，3 向后移动一位，与 2 比较，不需移动，将取出的 2 放到原来 3 的位置即可，至此完成排序。

`2 2 3 5 6`

### 实现

```java
public class StraightInsert {

    /**
     * 直接插入排序
     * 
     * @param array
     * @return
     */
    public static int[] sort(int[] array) {
        // 将第一个i=0作为已排序组
        for (int i = 1; i < array.length; i++) {
            System.out.println("第" + i + "轮比较结果：");
            // 取出i索引待排序元素
            int temp = array[i];
            int j;
            // 从已排序数组后面往前逐个比较，确定i元素的位置，并将相应的元素后移一位
            for (j = i - 1; j >= 0 && temp < array[j]; j--) {
                array[j + 1] = array[j];
            }
            // 找到了位置
            array[j + 1] = temp;
            // 输出此轮排序结果
            for (int k : array) {
                System.out.print(k + " ");
            }
            System.out.println();
        }
        return array;
    }

    public static void main(String[] args) {
        int[] array = { 3, 5, 2, 6, 2 };
        int[] sorted = sort(array);
        System.out.println("最终结果");
        for (int i : sorted) {
            System.out.print(i + " ");
        }
    }

}
```

## 希尔排序

希尔排序的思想是将一个大的数组“分而治之”，划分为若干个小的数组，然后分别对划分出来的数组进行插入排序。

希尔排序是基于插入排序的以下两点性质而提出改进方法的：

- 插入排序在对几乎已经排好序的数据操作时， 效率高， 即可以达到线性排序的效率
- 但插入排序一般来说是低效的， 因为插入排序每次只能将数据移动一位

![](https://sfault-image.b0.upaiyun.com/374/351/3743512948-57314cb358d7e_articlex)

### 步骤

1. 取增量，一般取数组长度/2
2. 按增量取得一个子数列，对子数列按插入排序的方式处理
3. 将增量递减，重复1,2步骤
4. 直至增量为为0，数列已经排好序

希尔排序是插入排序的改进版，在数据量大的时候对效率的提升帮助很大，数据量小的时候建议直接使用插入排序就好了。

### 实例

原始数据：

`3 5 2 6 2`

取`5/2=2`作为增量，对`[3 2 2]`进行插入排序，得到

`2 5 2 6 3`

对`[5 6]`进行插入排序，得到

`2 5 2 6 3`

对`[2 3]`进行插入排序，得到

`2 5 2 6 3`

增量递减`2/2=1`，对`[2 5 2 6 3]`进行插入排序，得到

`2 2 3 5 6`

增量递减为0，排序结束。

直接插入排序是稳定的，但希尔排序是不稳定的。

举个例子，如果我们的数据是：`3 5 4 2 2`, 稳定的排序最后的俩个2在排好序后他们的原始前后顺序是不会变的，但是使用我们上面的希尔排序两个2的前后顺序会颠倒。

### 实现

```java
public class Shell {

    /**
     * 希尔排序
     * 
     * @param array
     * @return
     */
    public static int[] sort(int[] array) {
        int step = array.length / 2;
        while (step >= 1) {
            // 子插入排序
            for (int i = step; i < array.length; i++) {
                // 取出i索引待排序元素
                int temp = array[i];
                int j;
                // 从已排序数组后面往前逐个比较，确定i元素的位置，并将相应的元素后移step位
                for (j = i - step; j >= 0 && temp < array[j]; j -= step) {
                    array[j + step] = array[j];
                }
                // 找到了位置
                array[j + step] = temp;
            }
            System.out.println("增量为：" + step + ",结果：");
            for (int k : array) {
                System.out.print(k + " ");
            }
            System.out.println();
            step /= 2;
        }
        return array;
    }

    public static void main(String[] args) {
        int[] array = { 3, 5, 2, 6, 2 };
        int[] sorted = sort(array);
        System.out.println("最终结果");
        for (int i : sorted) {
            System.out.print(i + " ");
        }
    }

}
```

## 简单选择排序

在要排序的一组数中，选出最小的一个数与第1个位置的数交换；然后在剩下的数当中再找最小的与第2个位置的数交换，依次类推，直到第n-1个元素（倒数第二个数）和第n个元素（最后一个数）比较为止。

![](https://sfault-image.b0.upaiyun.com/218/978/2189786007-55eda2db3ef55_articlex)

### 步骤

1. 从n 个记录中找出关键码最小的记录与第一个记录交换
2. 从第2 个记录开始的 n-1 个记录中再选出最小的记录与第2 个记录交换
3. 从第i (i是不断+1的)个记录开始的 n-i+1 个记录中选出最小的与第i 个记录交换
4. 直到整个序列有序

### 实例

原始数据：

`3 5 2 6 2`

第一轮，找出 `[5 2 6 2]` 中最小的第一个 2 ，与第一个位置的 3 进行交换

`2 5 3 6 2`

第二轮，找出 `[3 6 2]` 中最小的 2 与第一轮中第二个位置的 5 进行交换

`2 2 3 6 5`

第三轮，找出 `[6 5]` 中最小的 5 与第二轮中第三个位置的 3 不需交换

`2 2 3 6 5`

第四轮，找出 `[5]` 中最小的 5 与第三轮中的第四个位置的 6 进行交换

`2 2 3 5 6`

第五轮，没有了，最终结果

`2 2 3 5 6`

简单选择排序也可以认为是稳定的排序。

简单选择排序是不稳定的，如果原始数据为`3 3 2 6 2`, 第一轮时两个3的位置就前后变化了。

### 实现

```java
public class SimpleSelect {

    /**
     * 简单选择排序
     * 
     * @param array
     * @return
     */
    public static int[] sort(int[] array) {
        for (int i = 0; i < array.length; i++) {
            System.out.println("第" + (i + 1) + "轮比较结果：");
            int minPosition = i;
            // 找出i之后的数组中的最小索引
            for (int j = i + 1; j < array.length; j++) {
                if (array[j] < array[minPosition]) {
                    minPosition = j;
                }
            }
            // 判断是否需要调换位置
            if (array[i] > array[minPosition]) {
                int temp = array[i];
                array[i] = array[minPosition];
                array[minPosition] = temp;
            }
            // 输出此轮排序结果
            for (int k : array) {
                System.out.print(k + " ");
            }
            System.out.println();
        }
        return array;
    }

    public static void main(String[] args) {
        int[] array = { 3, 5, 2, 6, 2 };
        int[] sorted = sort(array);
        System.out.println("最终结果");
        for (int i : sorted) {
            System.out.print(i + " ");
        }
    }

}
```

## 堆排序

堆排序是一种树形选择排序，是对直接选择排序的有效改进。

堆的定义如下：具有n个元素的序列(k1,k2,...,kn), 当且仅当满足:

![](https://sfault-image.b0.upaiyun.com/107/109/1071098323-57314c1373de1_articlex)

时称之为堆。由堆的定义可以看出，堆顶元素（即第一个元素）必为最小项（小顶堆）或最大项（大顶堆）。

若以一维数组存储一个堆，则堆对应一棵完全二叉树，且所有非叶结点（有子女的结点）的值均不大于(或不小于)其子女的值，根结点（堆顶元素）的值是最小(或最大)的。

(a)大顶堆序列：`(96, 83, 27, 38, 11, 09)`

(b)小顶堆序列：`(12, 36, 24, 85, 47, 30, 53, 91)`

![](https://sfault-image.b0.upaiyun.com/150/617/1506170587-57314c130d552_articlex)

### 步骤

1. 初始时把要排序的n 个数的序列看作是一棵**顺序存储的二叉树**
2. 调整它们的顺序，使之成为一个堆，将堆顶元素输出，得到n 个元素中最小(或最大)的元素。
3. 然后对剩下的n-1个元素重新调整使之成为堆，输出堆顶元素，得到n 个元素中次小(或次大)的元素。
4. 依此类推，直到最后得到有n个节点的有序序列。

### 实例

实现堆排序需解决两个问题：

- 如何将n 个待排序的数建成堆；
- 输出堆顶元素后，怎样调整剩余n-1 个元素，使其成为一个新堆。

建堆方法（小顶堆）：

对初始序列建堆的过程，就是一个反复进行筛选的过程。

1. n 个结点的完全二叉树，则最后一个结点是第n/2个结点的子树。
2. 筛选从第n/2个结点为根的子树开始（n/2是最后一个有子树的结点），使该子树成为堆。
3. 之后向前依次对各结点为根的子树进行筛选，使之成为堆，直到根结点。

如图建堆初始过程

无序序列：`(49, 38, 65, 97, 76, 13, 27, 49)`

![](https://sfault-image.b0.upaiyun.com/207/446/2074467834-57314c1431991_articlex)

(a) 无序序列，初始二叉树，97（第`8/2=4`个结点）为最后一个结点（49）的父结点。 

(b) `97>=49`,替换位置，接下来对`8/2-1=3`结点65进行筛选。 

(c) `13<=27`且`65>=13`,替换65和13的位置，接下来对38进行替换（都大于它，不需操作），对顶部的49进行筛选。 

(d) `13<=38`且`49>=13`,替换49和13的位置，`49>=27`,替换49和27的位置。 

(e) 最终得到一个堆，13是我们得到的最小数。

调整堆的方法（小顶堆）：

1. 设有m 个元素的堆，输出堆顶元素后，剩下m-1 个元素。将堆底元素送入堆顶，堆被破坏，其原因仅是**根结点不满足堆**的性质。
2. 将不满足堆的结点与左、右子树中较小元素的进行交换。
3. 若与左子树交换：如果左子树堆被破坏，则重复方法(2).
4. 若与右子树交换，如果右子树堆被破坏，则重复方法(2).
5. 继续对不满足堆性质的子树进行上述交换操作，直到叶子结点，堆被建成。

调整堆只需考虑被破坏的结点，其他的结点不需调整。

![](https://sfault-image.b0.upaiyun.com/229/312/2293121565-57314c14ca2ed_articlex)

堆排序也是不稳定的。

### 实现

```java
public class HeapSort {

    /** 
     * 调整为小顶堆（排序后结果为从大到小）
     * 
     * @param array是待调整的堆数组 
     * @param s是待调整的数组元素的位置
     * @param length是数组的长度
     * 
     */
    public static void heapAdjustS(int[] array, int s, int length) {
        int tmp = array[s];
        int child = 2 * s + 1;// 左孩子结点的位置
        System.out.println("待调整结点为：array[" + s + "] = " + tmp);
        while (child < length) {
            // child + 1 是当前调整结点的右孩子
            // 如果有右孩子且小于左孩子，使用右孩子与结点进行比较，否则使用左孩子
            if (child + 1 < length && array[child] > array[child + 1]) {
                child++;
            }
            System.out.println("将与子孩子 array[" + child + "] = " + array[child] + " 进行比较");
            // 如果较小的子孩子比此结点小
            if (array[s] > array[child]) {
                System.out.println("子孩子比其小，交换位置");
                array[s] = array[child];// 把较小的子孩子向上移动，替换当前待调整结点
                s = child;// 待调整结点移动到较小子孩子原来的位置
                array[child] = tmp;
                child = 2 * s + 1;// 继续判断待调整结点是否需要继续调整

                if (child >= length) {
                    System.out.println("没有子孩子了，调整结束");
                } else {
                    System.out.println("继续与新的子孩子进行比较");
                }
            } else {
                System.out.println("子孩子均比其大，调整结束");
                break;// 当前待调整结点小于它的左右孩子，不需调整，直接退出
            }
        }
    }

    /** 
     * 调整为大顶堆（排序后结果为从小到大）
     * 
     * @param array是待调整的堆数组 
     * @param s是待调整的数组元素的位置
     * @param length是数组的长度
     * 
     */
    public static void heapAdjustB(int[] array, int s, int length) {
        int tmp = array[s];
        int child = 2 * s + 1;// 左孩子结点的位置
        System.out.println("待调整结点为：array[" + s + "] = " + tmp);
        while (child < length) {
            // child + 1 是当前调整结点的右孩子
            // 如果有右孩子且大于左孩子，使用右孩子与结点进行比较，否则使用左孩子
            if (child + 1 < length && array[child] < array[child + 1]) {
                child++;
            }
            System.out.println("将与子孩子 array[" + child + "] = " + array[child] + " 进行比较");
            // 如果较大的子孩子比此结点大
            if (array[s] < array[child]) {
                System.out.println("子孩子比其大，交换位置");
                array[s] = array[child];// 把较大的子孩子向上移动，替换当前待调整结点
                s = child;// 待调整结点移动到较大子孩子原来的位置
                array[child] = tmp;
                child = 2 * s + 1;// 继续判断待调整结点是否需要继续调整

                if (child >= length) {
                    System.out.println("没有子孩子了，调整结束");
                } else {
                    System.out.println("继续与新的子孩子进行比较");
                }
            } else {
                System.out.println("子孩子均比其小，调整结束");
                break;// 当前待调整结点大于它的左右孩子，不需调整，直接退出
            }
        }
    }

    /**
     * 堆排序算法
     * 
     * @param array
     * @param inverse true 为倒序排列，false 为正序排列
     */
    public static void heapSort(int[] array, boolean inverse) {
        // 初始堆
        // 最后一个有孩子的结点位置 i = (length - 1) / 2, 以此向上调整各结点使其符合堆
        System.out.println("初始堆开始");
        for (int i = (array.length - 1) / 2; i >= 0; i--) {
            if (inverse) {
                heapAdjustS(array, i, array.length);
            } else {
                heapAdjustB(array, i, array.length);
            }
        }
        System.out.println("初始堆结束");
        for (int i = array.length - 1; i > 0; i--) {
            // 交换堆顶元素H[0]和堆中最后一个元素
            int tmp = array[i];
            array[i] = array[0];
            array[0] = tmp;
            // 每次交换堆顶元素和堆中最后一个元素之后，都要对堆进行调整
            if (inverse) {
                heapAdjustS(array, 0, i);
            } else {
                heapAdjustB(array, 0, i);
            }
        }
    }

    public static void main(String[] args) {
        int[] array = { 49, 38, 65, 97, 76, 13, 27, 49 };
        heapSort(array, false);
        for (int i : array) {
            System.out.print(i + " ");
        }
    }

}
```

## 归并排序

归并（Merge）排序法是将两个（或两个以上）有序表合并成一个新的有序表，即把待排序序列分为若干个子序列，每个子序列是有序的。然后再把有序子序列合并为整体有序序列。

归并排序采用的是递归来实现，属于“分而治之”，将目标数组从中间一分为二，之后分别对这两个数组进行排序，排序完毕之后再将排好序的两个数组“归并”到一起，归并排序最重要的也就是这个“归并”的过程，归并的过程中需要额外的跟需要归并的两个数组长度一致的空间。

![](https://sfault-image.b0.upaiyun.com/113/837/1138379171-55eda9ea30839_articlex)

### 步骤

1. 申请空间，使其大小为两个已经排序序列之和，该空间用来存放合并后的序列
2. 设定两个指针，最初位置分别为两个已经排序序列的起始位置
3. 比较两个指针所指向的元素，选择相对小的元素放入到合并空间，并移动指针到下一位置
4. 重复步骤3直到某一指针达到序列尾
5. 将另一序列剩下的所有元素直接复制到合并序列尾

### 实例

原始数据：

`3 5 2 6 2`

归并的前提是将数组分开，一分为二，再一分为二，分到不能再分，进行归并。

第一轮分隔，索引2 (`(0+4)/2=2`) 为中间

`[3 5 2] [6 2]`

第二轮分隔，对`[3 5 2]`进行分隔

`[3 5] [2] [6 2]`

第三轮分隔，对`[3 5]`进行分隔

`[3] [5] [2] [6 2]`

合并`[3] [5]`

`[3 5] [2] [6 2]`

合并`[3 5] [2]`

`[2 3 5] [6 2]`

第四轮分隔，对`[6 2]`进行分隔

`[2 3 5] [6] [2]`

合并`[6] [2]`

`[2 3 5] [2 6]`

合并`[2 3 5] [2 6]`

`[2 2 3 5 6]`

### 实现

```java
public class Merge {

    private static int mark = 0;

    /**
     * 归并排序
     * 
     * @param array
     * @return
     */
    public static int[] sort(int[] array) {
        return sort(array, 0, array.length - 1);
    }

    /**
     * 归并排序
     * 
     * @param array
     * @param low
     * @param high
     * @return
     */
    private static int[] sort(int[] array, int low, int high) {
        int mid = (low + high) / 2;
        if (low < high) {
            mark++;
            System.out.println("正在进行第" + mark + "次分隔，得到");
            System.out.println("[" + low + "-" + mid + "] [" + (mid + 1) + "-" + high + "]");
            // 左边数组
            sort(array, low, mid);
            // 右边数组
            sort(array, mid + 1, high);
            // 左右归并
            merge(array, low, mid, high);
        }
        return array;
    }

    /**
     * 对数组进行归并
     * 
     * @param array
     * @param low
     * @param mid
     * @param high
     */
    private static void merge(int[] array, int low, int mid, int high) {
        System.out.println("合并:[" + low + "-" + mid + "] 和 [" + (mid + 1) + "-" + high + "]");
        int[] temp = new int[high - low + 1];
        int i = low;// 左指针
        int j = mid + 1;// 右指针
        int k = 0;
        // 把较小的数先移到新数组中
        while (i <= mid && j <= high) {
            if (array[i] < array[j]) {
                temp[k++] = array[i++];
            } else {
                temp[k++] = array[j++];
            }
        }
        // 两个数组之一可能存在剩余的元素
        // 把左边剩余的数移入数组
        while (i <= mid) {
            temp[k++] = array[i++];
        }
        // 把右边边剩余的数移入数组
        while (j <= high) {
            temp[k++] = array[j++];
        }
        // 把新数组中的数覆盖array数组
        for (int m = 0; m < temp.length; m++) {
            array[m + low] = temp[m];
        }
    }

    public static void main(String[] args) {
        int[] array = { 3, 5, 2, 6, 2 };
        int[] sorted = sort(array);
        System.out.println("最终结果");
        for (int i : sorted) {
            System.out.print(i + " ");
        }
    }

}
```

