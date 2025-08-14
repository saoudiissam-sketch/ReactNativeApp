import { z } from 'zod';

// Schémas de validation pour les formulaires

export const personalInfoSchema = z.object({
  fullName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes'),
  
  jobTitle: z.string()
    .min(2, 'Le titre doit contenir au moins 2 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  
  email: z.string()
    .email('Adresse email invalide')
    .max(100, 'L\'email ne peut pas dépasser 100 caractères'),
  
  phone: z.string()
    .regex(/^(?:\+33|0)[1-9](?:[.-]?[0-9]{2}){4}$/, 'Numéro de téléphone français invalide')
    .optional()
    .or(z.literal(''))
});

export const experienceSchema = z.object({
  jobTitle: z.string()
    .min(2, 'Le titre du poste doit contenir au moins 2 caractères')
    .max(100, 'Le titre du poste ne peut pas dépasser 100 caractères'),
  
  company: z.string()
    .min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères')
    .max(100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères'),
  
  startDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{4}$|^\d{4}$/, 'Format: MM/AAAA ou AAAA')
    .optional()
    .or(z.literal('')),
  
  endDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{4}$|^\d{4}$|^Présent$/, 'Format: MM/AAAA, AAAA ou "Présent"')
    .optional()
    .or(z.literal('')),
  
  description: z.string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional()
    .or(z.literal(''))
});

export const educationSchema = z.object({
  degree: z.string()
    .min(2, 'Le diplôme doit contenir au moins 2 caractères')
    .max(100, 'Le diplôme ne peut pas dépasser 100 caractères'),
  
  school: z.string()
    .min(2, 'Le nom de l\'établissement doit contenir au moins 2 caractères')
    .max(100, 'Le nom de l\'établissement ne peut pas dépasser 100 caractères'),
  
  startDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{4}$|^\d{4}$/, 'Format: MM/AAAA ou AAAA')
    .optional()
    .or(z.literal('')),
  
  endDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{4}$|^\d{4}$/, 'Format: MM/AAAA ou AAAA')
    .optional()
    .or(z.literal(''))
});

export const skillsSchema = z.object({
  skills: z.string()
    .min(5, 'Veuillez entrer au moins 5 caractères pour vos compétences')
    .max(500, 'Les compétences ne peuvent pas dépasser 500 caractères')
    .refine(
      (skills) => skills.split(',').filter(s => s.trim().length > 0).length >= 2,
      'Veuillez entrer au moins 2 compétences séparées par des virgules'
    )
});

// Schéma complet pour un CV
export const cvSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: experienceSchema,
  education: educationSchema,
  skills: skillsSchema.shape.skills
});

// Schéma pour Magic Apply
export const magicApplySchema = z.object({
  jobUrl: z.string()
    .url('URL invalide')
    .refine(
      (url) => {
        const domain = new URL(url).hostname.toLowerCase();
        return ['linkedin.com', 'indeed.com', 'welcometothejungle.com', 'apec.fr', 'pole-emploi.fr']
          .some(validDomain => domain.includes(validDomain));
      },
      'URL non supportée. Utilisez LinkedIn, Indeed, Welcome to the Jungle, APEC ou Pôle Emploi'
    )
});

// Types dérivés
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type ExperienceData = z.infer<typeof experienceSchema>;
export type EducationData = z.infer<typeof educationSchema>;
export type SkillsData = z.infer<typeof skillsSchema>;
export type CVData = z.infer<typeof cvSchema>;
export type MagicApplyData = z.infer<typeof magicApplySchema>;

// Fonctions utilitaires de validation
export const validatePersonalInfo = (data: any): { success: boolean; errors: string[] } => {
  try {
    personalInfoSchema.parse(data);
    return { success: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Erreur de validation inconnue'] };
  }
};

export const validateExperience = (data: any): { success: boolean; errors: string[] } => {
  try {
    experienceSchema.parse(data);
    return { success: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Erreur de validation inconnue'] };
  }
};

export const validateEducation = (data: any): { success: boolean; errors: string[] } => {
  try {
    educationSchema.parse(data);
    return { success: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Erreur de validation inconnue'] };
  }
};

export const validateSkills = (data: any): { success: boolean; errors: string[] } => {
  try {
    skillsSchema.parse(data);
    return { success: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Erreur de validation inconnue'] };
  }
};

export const validateCV = (data: any): { success: boolean; errors: string[] } => {
  try {
    cvSchema.parse(data);
    return { success: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.map(String).join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Erreur de validation inconnue'] };
  }
};

export const validateMagicApply = (data: any): { success: boolean; errors: string[] } => {
  try {
    magicApplySchema.parse(data);
    return { success: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.map(String).join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Erreur de validation inconnue'] };
  }
};

// Helper pour nettoyer les données
export const cleanCVData = (data: any) => {
  return {
    personalInfo: {
      fullName: data.personalInfo?.fullName?.trim() || '',
      jobTitle: data.personalInfo?.jobTitle?.trim() || '',
      email: data.personalInfo?.email?.trim().toLowerCase() || '',
      phone: data.personalInfo?.phone?.trim().replace(/[.-\s]/g, '') || ''
    },
    experience: {
      jobTitle: data.experience?.jobTitle?.trim() || '',
      company: data.experience?.company?.trim() || '',
      startDate: data.experience?.startDate?.trim() || '',
      endDate: data.experience?.endDate?.trim() || '',
      description: data.experience?.description?.trim() || ''
    },
    education: {
      degree: data.education?.degree?.trim() || '',
      school: data.education?.school?.trim() || '',
      startDate: data.education?.startDate?.trim() || '',
      endDate: data.education?.endDate?.trim() || ''
    },
    skills: data.skills?.trim() || ''
  };
};