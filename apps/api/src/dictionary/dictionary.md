# 🧠 Dictionary App 词典模块设计说明（中英文对照）

## 🧩 项目背景 / Project Background

我正在设计一个结构化的词典 App，聚焦单词的使用属性、构词规律和语境分类。
I'm designing a structured dictionary app focused on word usage features, word formation patterns, and contextual classification.


### 单词基础信息
单词本体（英文）

### 单词变体

词性

意思

词性+意思的组合其实就是这个变体本身

图片（可选，用于辅助记忆）

发音（英式、美式）

这个变体是否是口语常用词，是否是书面常用词当然这个词有可能即是口语又是书面


### 单词变体属性标签
常用程度：1～5 星，表示该词在实际语言中使用的频率（5 星表示特别常用）

使用场景：是否属于口语场景 / 是否属于书面语场景

情绪强度：从 1 到 5 星表示该词的情绪色彩强弱（如咆哮是5，提醒是1）

褒贬义倾向：从 1 到 5 表示语义倾向（1表示强烈贬义，3为中性，5为强烈褒义）

习得年龄段：母语者通常在什么年龄学习掌握该词（如“6-9岁”、“10-12岁”等）

### 变体例句
变体外联表例句，一对多，并标识是口语例句还是书面例句

### 构词结构：词根/词缀信息
这应该是跟变体建立关系还是跟单词建立关系，我现在拿不准。

是否是词根

是否是前词缀

是否是后词缀

英文含义

中文含义

关联：使用了该词根的其他单词（按常用程度排序），我准备设计2个字段来做对应，前期因为我数据库可能不够完整需要关联词的文本，后续当数据库够全面我希望直接关联variantId



### 同义词
变体对同义词是一对多关系，前期也是关联词文本，后续关联variantId


---

## 📐 数据模型设计 / Data Model Design

### 🔠 单词基础信息 / Word Basic Info

* **单词本体**：英文原词 / Word text
* **发音**：英式（UK）与美式（US）音标或音频 / Pronunciation in UK and US
* **图片**：辅助记忆用图（可选）/ Associated image (optional)

### 🏷️ 单词属性 / Word Attributes

* **常用程度**：1～5 星表示使用频率 / Frequency score (1 to 5 stars)
* **习得年龄段**：母语者通常掌握该词的年龄段 / Typical age group when native speakers learn this word (e.g., "6-9", "10-12")
* **使用场景**：是否属于口语或书面语 / Whether used in spoken and/or written contexts
* **情绪强度**：表示情绪色彩的强弱（1\~5）/ Emotion intensity (1 to 5)
* **褒贬义倾向**：语义倾向程度，1表示强烈贬义，5表示强烈褒义 / Polarity from 1 (strongly negative) to 5 (strongly positive), 3 is neutral

### 🧬 构词结构 / Word Roots

* **词根或词缀文本** / Root or affix text
* **英文含义** / Meaning in English
* **中文含义** / Meaning in Chinese
* **是否前缀 / 后缀** / Whether it is a prefix or suffix
* **使用了该词根的单词**（按使用频率排序）/ Other words using this root (sorted by frequency)
* **展示其使用场景（口语/书面）** / Indicate if commonly used in spoken or written forms

### 📚 同义词系统 / Synonym System

#### ✅ 1. 口语同义词表 / Spoken Synonyms Table

* 提供更常用于口语表达的近义词 / Synonyms used in informal/spoken scenarios
* **按频率排序** / Sorted by frequency
* 每项包括：

    * 同义词文本 / Synonym
    * 英文例句 / Example sentence
    * 中文翻译 / Translation

#### ✅ 2. 书面同义词表 / Written Synonyms Table

* 提供正式或书面场景的常用同义词 / Synonyms used in formal/written contexts
* 与口语同义词结构相同 / Same structure as spoken synonyms

---

## 🧰 技术实现需求 / Technical Implementation Requirements

### ⚙️ 使用技术栈 / Tech Stack

* TypeScript
* NestJS + TypeORM + GraphQL
* PostgreSQL
* Redis（可选，用于缓存或辅助搜索）
* Next.js（前端）

### 🔧 实体结构 / Entity Overview

#### `Word`（主表）

* `id`, `word`, `pronunciationUk`, `pronunciationUs`, `imageUrl`
* `frequencyScore`, `ageLearned[]`, `isSpoken`, `isWritten`, `emotionLevel`, `polarity`
* 多对多：`roots`
* 一对多：`spokenSynonyms`, `writtenSynonyms`

#### `WordRoot`

* `root`, `meaning`, `meaningCn`, `isPrefix`, `isSuffix`
* 多对多：`words`

#### `SynonymSpoken` / `SynonymWritten`

* `synonym`, `frequencyScore`, `exampleSentence`, `exampleTranslation`
* 多对一：`word`

---

## 🔍 GraphQL 功能需求 / GraphQL Functional Requirements

### ✅ 查询一个词 / Query a Word

```graphql
query {
  word(word: "ferocious") {
    word
    pronunciationUk
    pronunciationUs
    imageUrl
    frequencyScore
    ageLearned
    isSpoken
    isWritten
    emotionLevel
    polarity
    roots {
      root
      meaning
      meaningCn
      isPrefix
      isSuffix
    }
    spokenSynonyms {
      synonym
      frequencyScore
      exampleSentence
      exampleTranslation
    }
    writtenSynonyms {
      synonym
      frequencyScore
      exampleSentence
      exampleTranslation
    }
  }
}
```

### ✅ 发布一个词 / Publish a Word

```graphql
mutation {
  publishWord(input: {
    word: "ferocious",
    pronunciationUk: "/fəˈrəʊʃəs/",
    pronunciationUs: "/fəˈroʊʃəs/",
    imageUrl: "https://example.com/images/ferocious.jpg",
    frequencyScore: 3,
    ageLearned: ["10-12", "13-17"],
    isSpoken: true,
    isWritten: true,
    emotionLevel: 4,
    polarity: 2,
    roots: [
      {
        root: "fer",
        meaning: "fierce or wild",
        meaningCn: "激烈的；野性的",
        isPrefix: false,
        isSuffix: false
      }
    ],
    spokenSynonyms: [
      {
        synonym: "fierce",
        frequencyScore: 4,
        exampleSentence: "The dog looked fierce but was actually very friendly.",
        exampleTranslation: "那只狗看起来很凶，但其实很友善。"
      }
    ],
    writtenSynonyms: [
      {
        synonym: "intense",
        frequencyScore: 4,
        exampleSentence: "The debate became increasingly intense.",
        exampleTranslation: "辩论变得愈发激烈。"
      }
    ]
  }) {
    id
    word
  }
}
```

---

