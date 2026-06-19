import fs from 'fs';
import path from 'path';

const stubContent = `
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
export const getOauthConfig = (...args: any[]) => null;
export const Login = (props: any) => null;
export default () => null;
`;

const filesToStub = [
  'src/commands/login/login.tsx',
  'src/constants/oauth.ts',
  'src/components/FeedbackSurvey/FeedbackSurveyView.tsx',
  'src/components/FeedbackSurvey/utils.ts',
  'src/components/FeedbackSurvey/useFeedbackSurvey.ts',
  'src/components/FeedbackSurvey/useMemorySurvey.ts',
  'src/components/FeedbackSurvey/usePostCompactSurvey.ts',
  'src/components/FeedbackSurvey/FeedbackSurvey.tsx',
  'src/services/oauth/client.ts',
  'src/services/oauth/types.ts',
  'src/utils/telemetry/instrumentation.ts',
  'src/utils/telemetry/betaSessionTracing.ts',
  'src/utils/telemetryAttributes.ts',
  'src/utils/telemetry/events.ts',
  'src/utils/telemetry/pluginTelemetry.ts',
  'src/utils/telemetry/skillLoadedEvent.ts',
  'src/utils/telemetry/sessionTracing.ts',
  'src/utils/telemetry/perfettoTracing.ts',
  'src/tools/BriefTool/upload.ts'
];

for (const file of filesToStub) {
  const fullPath = path.resolve('/Users/maith/Desktop/ur3-gemini/UR-1.5.0', file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, stubContent);
}

const filesToRevert = [
  'src/components/PromptInput/PromptInput.tsx',
  'src/hooks/useSearchInput.ts',
  'src/hooks/useTextInput.ts',
  'src/hooks/useVimInput.ts',
  'src/utils/ur_editor.ts'
];

for (const file of filesToRevert) {
  const fullPath = path.resolve('/Users/maith/Desktop/ur3-gemini/UR-1.5.0', file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/ur_editor/g, 'cursor');
    content = content.replace(/UrEditor/g, 'Cursor');
    fs.writeFileSync(fullPath, content);
  }
}

if (fs.existsSync('src/utils/ur_editor.ts')) {
  fs.renameSync('src/utils/ur_editor.ts', 'src/utils/cursor.ts');
}

console.log('Fixed types and variables');
