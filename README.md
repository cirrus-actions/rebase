# GitHub action to automatically rebase PRs

[![Build Status](https://api.cirrus-ci.com/github/cirrus-actions/rebase.svg)](https://cirrus-ci.com/github/cirrus-actions/rebase) [![](https://images.microbadger.com/badges/version/cirrusactions/rebase.svg)](https://microbadger.com/images/cirrusactions/rebase) [![](https://images.microbadger.com/badges/image/cirrusactions/rebase.svg)](https://microbadger.com/images/cirrusactions/rebase)

After installation simply comment `/rebase` to trigger the action:

![rebase-action](https://user-images.githubusercontent.com/989066/51547853-14a57b00-1e35-11e9-841d-33114f0f0bd5.gif)

# Limitations

Due to current [limitations of GitHub Actions](https://developer.github.com/actions/):

> GitHub Actions is limited to private repositories and push events in public repositories during the limited public beta.

*Rebase* action currently only works on private repositories since it requires `IssueCommentEvent` event.

# Installation

To configure the action simply add the following lines to your `.github/main.workflow` workflow file:

```
workflow "Automatic Rebase" {
  on = "issue_comment"
  resolves = "Rebase"
}

action "Rebase" {
  uses = "docker://cirrusactions/rebase:latest"
  secrets = ["GITHUB_TOKEN"]
}
```
