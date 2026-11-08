export class DialogueManager {
  static PRAISE_POOL = [
    "برافو !",
    "شطورة!",
    "عاش!",
    "أيوه كده!",
    "الله عليكي!",
    "ممتاز!",
    "عرفتيها!",
    "يا سلام!",
    "حلو أوي!",
    "إجابة صح!"
  ];

  static ENCOURAGE_POOL = [
    "قربي كده...",
    "بصي تاني.",
    "هممم... نجرب مرة كمان؟",
    "ولا يهمك.",
    "خدي بالك.",
    "قربتي!"
  ];

  static GIFT_POOL = [
    "وااااو! هدية جديدة!",
    "يا سلام! شوفي الهدية دي!",
    "شطورة ، ليكي هدية!",
    "هدية جميلة عشانك!"
  ];

  static getRandomPraise(): string {
    return this.PRAISE_POOL[Math.floor(Math.random() * this.PRAISE_POOL.length)];
  }

  static getRandomEncouragement(): string {
    return this.ENCOURAGE_POOL[Math.floor(Math.random() * this.ENCOURAGE_POOL.length)];
  }

  static getRandomGiftReaction(): string {
    return this.GIFT_POOL[Math.floor(Math.random() * this.GIFT_POOL.length)];
  }
}
