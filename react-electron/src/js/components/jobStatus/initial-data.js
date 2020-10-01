const columns = [
  {
    id: 'column-1',
    columnTitle: 'Jobs',
    tasks: [
      {
        id: 'task-1',
        taskTitle: '8237',
        taskType: 'job',
        tasks: [
          {
            id: 'task-1_task-1',
            taskTitle: 'Take Out Garbage',
            tasks: [
              {
                id: 'task-1_task-1_task-1',
                taskTitle: 'Grab Trash Bag',
                tasks: [
                  {
                    id:'task-1_task-1_task-1_task-1',
                    taskTitle: 'Open Lid',
                    tasks: []
                  },
                  {
                    id:'task-1_task-1_task-1_task-2',
                    taskTitle: 'Reach Down',
                    tasks: []
                  }
                ]
              },
              {
                id: 'task-1_task-1_task-2',
                taskTitle: 'Take Trash Bag Outside',
                tasks: []
              }
            ]
          },
          {
            id: 'task-1_task-2',
            taskTitle: 'Charge phone',
            tasks: []
          }
        ]
      }
    ]
  },
  {
    id: 'column-2',
    columnTitle: 'Joe',
    tasks: []
  },
  {
    id: 'column-3',
    columnTitle: 'Sam',
    tasks: []
  }
]

export default columns;