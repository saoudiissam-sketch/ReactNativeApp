// Définition des types pour les données du CV pour plus de robustesse
interface PersonalInfo {
  fullName: string;
  jobTitle: string;
}

interface Experience {
  jobTitle: string;
  company: string;
  description: string;
}

interface Education {
  degree: string;
  school: string;
}

interface CvData {
  personalInfo: PersonalInfo;
  experience: Experience;
  education: Education;
  skills: string;
}

/**
 * Génère une lettre de motivation en utilisant l'IA.
 * @param cvData - Les données du CV de l'utilisateur.
 * @param jobDescription - La description du poste pour lequel postuler.
 * @returns Une promesse qui se résout avec la lettre de motivation générée.
 */
export const generateCoverLetter = async (
  cvData: CvData,
  jobDescription: string
): Promise<string> => {
  console.log("Préparation de la requête pour l'IA...");

  const prompt = `...`; // Le prompt détaillé est omis pour la lisibilité

  return new Promise(resolve => {
    setTimeout(() => {
      const mockLetter = `Lettre de motivation simulée pour ${cvData.personalInfo.fullName}`;
      resolve(mockLetter);
    }, 2000);
  });
};

// --- Nouvelle fonction pour le feedback d'entretien ---

export interface InterviewFeedback {
  clarity: string;
  relevance: string;
  suggestions: string[];
}

/**
 * Analyse la réponse d'un utilisateur à une question d'entretien et fournit un feedback.
 * @param question - La question posée.
 * @param answer - La réponse transcrite de l'utilisateur.
 * @returns Une promesse qui se résout avec un objet de feedback.
 */
export const getInterviewFeedback = async (
  question: string,
  answer: string
): Promise<InterviewFeedback> => {
  const prompt = `
    En tant que coach de carrière expert, évalue la réponse suivante à une question d'entretien.

    Question : "${question}"
    Réponse de l'utilisateur : "${answer}"

    Fournis une analyse concise sous forme d'objet JSON avec les clés suivantes :
    - "clarity": Évalue la clarté de la réponse (ex: "Très clair", "Plutôt clair", "Peu clair").
    - "relevance": Évalue la pertinence de la réponse par rapport à la question (ex: "Très pertinent", "Pertinent", "Hors-sujet").
    - "suggestions": Fournis un tableau de 2 ou 3 suggestions concrètes pour améliorer la réponse.

    Ne retourne que l'objet JSON, sans texte supplémentaire.
  `;

  console.log("Envoi de la requête de feedback à l'IA (simulation)");

  return new Promise(resolve => {
    setTimeout(() => {
      const mockFeedback: InterviewFeedback = {
        clarity: "Plutôt clair",
        relevance: "Très pertinent",
        suggestions: [
          "Essayez de structurer votre réponse avec la méthode STAR (Situation, Tâche, Action, Résultat).",
          "Soyez un peu plus concis pour maintenir l'attention du recruteur.",
          "Quantifiez vos réussites avec des chiffres si possible."
        ]
      };
      console.log("Réponse de feedback simulée reçue.");
      resolve(mockFeedback);
    }, 2000);
  });
};

// --- Nouvelle fonction pour le coaching en négociation salariale ---

/**
 * Fournit des conseils de négociation salariale basés sur le contexte donné.
 * @param jobRole - Le rôle du poste.
 * @param currentOffer - L'offre salariale actuelle.
 * @param desiredSalary - Le salaire désiré par l'utilisateur.
 * @param experienceYears - Le nombre d'années d'expérience de l'utilisateur.
 * @returns Une promesse qui se résout avec une chaîne de caractères contenant les conseils.
 */
export const getSalaryNegotiationAdvice = async (
  jobRole: string,
  currentOffer: string,
  desiredSalary: string,
  experienceYears: string
): Promise<string> => {
  const prompt = `
    En tant que coach expert en négociation salariale, fournis des conseils personnalisés pour la situation suivante :
    - Rôle du poste : ${jobRole}
    - Offre actuelle : ${currentOffer}
    - Salaire désiré : ${desiredSalary}
    - Années d'expérience : ${experienceYears}

    Les conseils doivent être professionnels, stratégiques et inclure des points clés à aborder lors de la négociation. Propose des arguments basés sur la valeur que le candidat peut apporter et sur le marché. Sois concis et direct.
  `;

  console.log("Envoi de la requête de conseils de négociation à l'IA (simulation)");

  return new Promise(resolve => {
    setTimeout(() => {
      const mockAdvice = `
      Conseils pour la négociation du poste de ${jobRole} :

      1.  **Mettez en avant votre valeur :** Rappelez vos réalisations passées et comment elles se traduiront en bénéfices concrets pour l'entreprise. Mentionnez spécifiquement comment vos ${experienceYears} années d'expérience vous positionnent idéalement.
      2.  **Justifiez votre demande :** Expliquez pourquoi ${desiredSalary}€ est un salaire juste et compétitif pour un rôle comme celui-ci, en vous basant sur vos compétences et les standards du marché.
      3.  **Négociez le package global :** Si l'entreprise ne peut pas atteindre ${desiredSalary}€, explorez d'autres avantages : bonus, stock-options, télétravail, formation, congés supplémentaires, etc.
      4.  **Restez professionnel et confiant :** Exprimez votre enthousiasme pour le poste tout en restant ferme sur votre valeur.
      5.  **Demandez un délai de réflexion :** Ne vous sentez pas obligé d'accepter immédiatement. Demandez un jour ou deux pour examiner l'offre.
      
      Bonne chance !
      `;
      console.log("Réponse de conseils de négociation simulée reçue.");
      resolve(mockAdvice);
    }, 2000);
  });
};

