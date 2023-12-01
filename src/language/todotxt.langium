grammar Todotxt

hidden terminal WS: /\s+/;
terminal PRIORITY: /\([A-Z]\)/;
terminal DATE: /\d{4}-\d{2}-\d{2}/;
terminal PROJECT: /\+\S+/;
terminal CONTEXT: /@\S+/;
terminal WORD: /\S+/;

// Entry rule that parses a list of tasks
entry TodoFile:
    tasks+=Task*;

// A single task, either complete or incomplete
Task:
    CompletedTask | IncompleteTask;

// Completed task with optional completion date and required creation date
CompletedTask:
    'x' dates=Dates? description=Description;

// Incomplete task with optional priority and creation date
IncompleteTask:
    priority=PRIORITY? dates=Dates? description=Description;

Dates:
    (completionDate=DATE creationDate=DATE | creationDate=DATE);

// A single task description, which is a sequence of words, projects, and contexts
Description:
    (text+=Word | project+=Project | context+=Context)*;

// A word is a sequence of non-whitespace characters excluding the special project and context symbols
Word:
    value=WORD;

// Project tagged with a plus sign
Project:
    name=PROJECT;

// Context tagged with an at sign
Context:
    name=CONTEXT;

