import type { Command } from '../../types/command.js'
import type { ContentBlockParam } from '@urhq-ai/sdk/resources/index.mjs'

const youtubeCmd: Command = {
  type: 'prompt',
  name: 'youtube',
  description: 'Fetch youtube subtitles or transcript and analyze',
  argumentHint: '<url>',
  progressMessage: 'analyzing youtube request',
  contentLength: 0,
  source: 'builtin',
  async getPromptForCommand(args: string): Promise<ContentBlockParam[]> {
    return [
      {
        type: 'text',
        text: `The user wants you to process a youtube video: ${args || 'Please ask the user for a YouTube URL.'}\nPlease use yt-dlp or similar tools to fetch the subtitles/transcript, and perform the tasks they requested instead of just summarizing it. Use playwright if necessary.`,
      },
    ]
  },
}
export default youtubeCmd
