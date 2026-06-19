
export const logOTelEvent = (...args: any[]) => {};
export const redactIfDisabled = (...args: any[]) => {};
export const startInteractionSpan = (...args: any[]) => ({ end: () => {} });
export const endInteractionSpan = (...args: any[]) => {};
export const recordPluginAction = (...args: any[]) => {};
export const recordSkillLoaded = (...args: any[]) => {};
export const logPluginLoadErrors = (...args: any[]) => {};
export const logPluginsEnabledForSession = (...args: any[]) => {};
export const logSkillsLoaded = (...args: any[]) => {};
export const getOAuthToken = (...args: any[]) => null;
export const initiateOAuth = (...args: any[]) => null;
export const AuthProvider = (...args: any[]) => null;
export const checkRateLimit = (...args: any[]) => null;
export const logEvent = (...args: any[]) => {};
export const FeedbackSurvey = (...args: any[]) => null;
export const useFeedbackSurvey = (...args: any[]): any => ({});
export const useMemorySurvey = (...args: any[]): any => ({});
export const usePostCompactSurvey = (...args: any[]): any => ({ handleSelect: () => {} });
export const FeedbackSurveyView = (...args: any[]) => null;
export const isValidResponseInput = (...args: any[]) => false;
export type FeedbackSurveyResponse = any;
export const uploadBrief = (...args: any[]) => null;
export const uploadTranscript = (...args: any[]) => null;
export const trackBetaSession = (...args: any[]) => null;
export const getTelemetryAttributes = (...args: any[]) => ({});
export const initializeTelemetry = (...args: any[]) => null;
export const isBetaTracingEnabled = (...args: any[]) => false;
export const populateOAuthAccountInfoIfNeeded = (...args: any[]) => null;
export const getOauthConfig = (...args: any[]) => ({
  OAUTH_FILE_SUFFIX: '',
  BASE_API_URL: '',
  TOKEN_URL: '',
  UR_AI_ORIGIN: '',
  AUTH_MODE: 'none',
  LOGIN_URL: '',
  OAUTH_CLIENT_ID: '',
  OAUTH_AUDIENCE: '',
});
export const Login = (props: any) => null;
export default () => null;

export const OAUTH_BETA_HEADER = "dummy";

export const fileSuffixForOauthConfig = () => "dummy";
export const MCP_CLIENT_METADATA_URL = "dummy";
export const UR_AI_INFERENCE_SCOPE = "dummy";
