import * as core from '@actions/core'
import * as github from '@actions/github'
import * as minimatch from 'minimatch'
import parse from 'parse-diff'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    const octokit = github.getOctokit(token)
    const requiredFilePatterns = core.getMultilineInput('filePatterns')

    if (requiredFilePatterns && github.context.payload.pull_request) {
      const diff_url = github.context.payload.pull_request?.diff_url
      const result = await octokit.request(diff_url)
      const files = parse(result.data)
      const fileTolist = files.map(file => `${file.to}`)
      core.debug(`File list: ${JSON.stringify(fileTolist)}`)
      core.debug(`Pattern list: ${JSON.stringify(requiredFilePatterns)}`)
      const unmatched = requiredFilePatterns
      for (const pattern of requiredFilePatterns) {
        if (minimatch.match(fileTolist, pattern)) {
          const patternIndex = unmatched.indexOf(pattern)
          if (patternIndex > -1) {
            unmatched.splice(patternIndex, 1)
          }
        }
      }
      if (unmatched.length > 0) {
        core.setFailed(
          `All required file patterns are not satisfied. No matching files for pattern ${unmatched[0]}`
        )
      }
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
