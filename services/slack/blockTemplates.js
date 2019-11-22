var Util = require("@/utils/index.js")

export function newTask(avatar, project, task, listName) {
  return `
  [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "You have a new task:\n*<http://localhost:3000/projects/${
          project.type
        }/${Util.default.stringToLink(project.name)}|${
    project.name
  }>* [${listName}]"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Description:*\n${
          task.description
        }\n*Difficulty:*\n${difficulty(task.difficulty)}\n*Hours:*\n ${
    task.hours
  }\n*Start Date:* \n${timestampToDate(task.startdate)}\n*Priority:* \n"
      },
      "accessory": {
        "type": "image",
        "image_url": "${avatar}",
        "alt_text": "computer thumbnail"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "emoji": true,
            "text": "${task.priority}"
          },
          ${priorityStyle(task.priority)}
        }
      ]
    }
  ]
  `
}

export function newNote(user, task, projectname, listName) {
  return `[
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "${user.first_name} has added a new note:\n Project: *${projectname}* \nTask: *${task}* [${listName}] \n\n _Check it out, it may be for you._"
			} , "accessory": {
        "type": "image",
        "image_url": "${user.avatar}",
        "alt_text": "computer thumbnail"
      }
		}
	]`
}

export function newUpload(user, task, projectname, listName) {
  return `[
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "${user.first_name} has uploaded a file:\n Project: *${projectname}* \nTask: *${task}* [${listName}] \n\n _Check it out, it may be for you._"
			} , "accessory": {
        "type": "image",
        "image_url": "${user.avatar}",
        "alt_text": "computer thumbnail"
      }
		}
	]`
}

export function taskCompleted(task, user, listName) {
  return `[
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "${user.first_name} has marked: *${task.description}* [${listName}] as complete"
			} , "accessory": {
        "type": "image",
        "image_url": "${user.avatar}",
        "alt_text": "computer thumbnail"
      }
		}
	]`
}

function difficulty(level) {
  switch (level) {
    case "easy":
      return "⚡"
    case "medium":
      return "⚡⚡"
    case "difficult":
      return "⚡⚡⚡"
  }
}

function priorityStyle(level) {
  let priority = {
    high: `"style":"danger"`,
    medium: "",
    low: `"style":"primary"`,
    default: ""
  }

  return priority[level] || priority["default"]
}

function timestampToDate(timestamp) {
  let date = new Date(timestamp.seconds * 1000)
  let month = date.getMonth()
  let day = date.getDate()
  let year = date.getFullYear()

  return `${day}/${month}/${year}`
}
