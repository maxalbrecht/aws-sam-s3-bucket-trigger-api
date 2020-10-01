const initialData = {
  jobs: {
    'job-1': {
      id: 'job-1',
      jobTitle: '8237',
      tasks: [
        {
          id: 'job-1-task-1',
          taskTitle: 'Take Out Garbage',
          tasks: [
            {
              id: 'job-1-task-1-task-1',
              taskTitle: 'Grab Trash Bag',
              tasks: [
                {
                  id:'job-1-task-1-task-1-task-1',
                  taskTitle: 'Open Lid',
                  tasks: []
                },
                {
                  id:'job-1-task-1-task-1-task-2',
                  taskTitle: 'Reach Down',
                  tasks: []
                }
              ]
            },
            {
              id: 'job-1-task-1-task-2',
              taskTitle: 'Take Trash Bag Outside',
              tasks: []
            }
          ]
        },
        {
          id: 'job-1-task-2',
          taskTitle: 'Charge phone',
          tasks: []
        }
      ]
    }
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Jobs',
      jobIds: ['job-1'],
      tasks: []
    },
    'column-2': {
      id: 'column-2',
      title: 'Joe',
      jobIds: [],
      tasks: []
    },
    'column-3': {
      id: 'column-3',
      title: 'Sam',
      jobIds: [],
      tasks: []
    }
  },
  //Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2', 'column-3']
}

export default initialData;