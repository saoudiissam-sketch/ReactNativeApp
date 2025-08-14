import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

// Types pour les paramètres des écrans
export type RootStackParamList = {
  Main: undefined;
  CvCreator: { cvId?: string } | undefined;
  VoiceCvCreator: undefined;
  MagicApply: undefined;
  CoverLetterGenerator: undefined;
  Portfolio: undefined;
};

export type MainTabParamList = {
  'Tableau de Bord': undefined;
  'Mes CVs': undefined;
  'Recherche': undefined;
  'Carrière IA': undefined;
  'Profil': undefined;
};

export type AiCareerStackParamList = {
  AiCareerHub: undefined;
  InterviewSimulator: undefined;
  SalaryNegotiation: undefined;
};

export type MyCvsStackParamList = {
  MyCvsList: undefined;
};

// Props types pour les écrans
export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type AiCareerStackScreenProps<T extends keyof AiCareerStackParamList> = CompositeScreenProps<
  StackScreenProps<AiCareerStackParamList, T>,
  MainTabScreenProps<keyof MainTabParamList>
>;

export type MyCvsStackScreenProps<T extends keyof MyCvsStackParamList> = CompositeScreenProps<
  StackScreenProps<MyCvsStackParamList, T>,
  MainTabScreenProps<keyof MainTabParamList>
>;

// Déclaration globale pour la navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}