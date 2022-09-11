# Required file changes
 
This action checks pull requests if it satisfies at least one change against a list of globs. This is useful when trying to force updates or new files to certain files or paths. 

# Usage

See [action.yml](action.yml)

### Check at least one change on `disk` folder exists

```yaml
- uses: required-file-changes@v0.0.1
  with:
    token: ${{github.token}}
    filePatterns: "dist/*"
```