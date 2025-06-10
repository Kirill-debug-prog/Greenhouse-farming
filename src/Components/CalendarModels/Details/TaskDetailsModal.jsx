import './TaskDetailsModal.css';
import { useState, useEffect } from 'react';
import InputSymbol from '../../Input/InputSymbol/InputSymbol';
import Button from '../../Button/Butten_culture/Butten_culture'

export default function TaskDetailsModal({ date, tasks, onClose }) {
  const [activTab, setActiveTab] = useState('planed');
  const [actualUsages, setActualUsages] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const [inputValues, setInputValues] = useState({});

  // Фильтрация задач по дате
  const selectedDate = new Date(date).toDateString();

  const tasksForDate = tasks.filter((task) =>
    new Date(task.plannedstartdatetime).toDateString() === selectedDate
  );


  const fetchActualDataGet = async (workingId) => {
    setLoading(prev => ({...prev, [workingId]: true}));
    try {
      const response = await fetch(`http://localhost:5180/api/workings/actual-usage/${workingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 404) {
        console.warn('Нет актуальных данных для этой работы') 
        setActualUsages(prev => ({ ...prev, [workingId]: null}))
      }
      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }
      const data = await response.json();
      if (data.length === 0) {
        setActualUsages(prev => ({ ...prev, [workingId]: null }));
      } else {
        setActualUsages(prev => ({ ...prev, [workingId]: data }));
      }
      console.log(data)
      setActualUsages(prev => ({...prev, [workingId]: data}));
    } catch (error) {
      console.error('Ошибка при получении фактических данных:', error);
      setError(error.message);
    }
    finally {
      setLoading(prev => ({...prev, [workingId]: false}));
    }
  };
    const fetchActualDataPost = async (workingId, dataToSend) => {
      setLoading(prev => ({...prev, [workingId]: true}));
      try {
        console.log('Отправляем:', JSON.stringify(dataToSend, null, 2));
        const response = await fetch(`http://localhost:5180/api/workings/actual-usage/${workingId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        , body: JSON.stringify(dataToSend)
        })

        // const responseText = await response.text()

        if (response.status === 409) {
          console.error('Конфликт при отправке данных', response.status, responseText);
          return;
        }
        if (!response.ok) {
          throw new Error('Ошибка при отправке данных');
        }
        const data = await response.json();
        setActualUsages(prev => ({...prev, [workingId]: data}));
      } catch (error) {
        console.error('Ошибка при отправке фактических данных:', error);
        setError(error.message);
      } finally {
        setLoading(prev => ({...prev, [workingId]: false}));
      }
    };
    useEffect(() => {
      if (activTab === 'fact') {
        tasks
          .filter((task) => new Date(task.plannedstartdatetime).toDateString() === selectedDate)
          .forEach(task => {
            const id = task.workingId;
            if (id !== undefined && !(id in actualUsages)) {
              fetchActualDataGet(id);
            }
          });
      }
    }, [activTab, date, tasks]);


    const handleInputChange = (workingId, resourceId, value) => {
      setInputValues(prev => ({
        ...prev,
        [workingId]: {
          ...prev[workingId],
          [resourceId]: value
        }
      }));
    };


    const handleAddData = (task) => {
      const workingId = task.workingId
      //Если данные уже загружены, просто переключаемся на вкладку фактических данных
      if (actualUsages[task.workingId]) return;

      //Если поля уже показаны - отправляем данные
      if (inputValues[task.workingId] !== undefined) {
        const resourceDtos = task.resources.map(res => ({
            resourceName: res.name,
          amountActualUsed: parseFloat(inputValues[workingId][res.resourceId]) || 0
        }))
        fetchActualDataPost(task.workingId, resourceDtos);
      }

        //Если данные еще не загружены, показываем поля для ввода
        else {
          const initialValues ={}
          task.resources.forEach(resource => {
            initialValues[resource.resourceId] = ''
          })
          setInputValues (prev => ({
            ...prev,
            [workingId]: initialValues
          }))
          fetchActualDataGet()
        }
      };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="toggle-buttons">
            {activTab === 'planed' ? (
              <>
              <button className='planed active' onClick={() => setActiveTab('planed')}>
                <span>По плану</span>
              </button>

              <button className='fact' onClick={() => setActiveTab('fact')}>
                <span>По факту</span>
              </button>
              </>
              ) : (
                <>
              <button className='planed' onClick={() => setActiveTab('planed')}>
                <span>По плану</span>
              </button>

              <button className='fact active' onClick={() => setActiveTab('fact')}>
                <span>По факту</span>
              </button>
              </>
            )}
          </div>
          <div className="modal-date">
            {new Date(date).toLocaleDateString('ru-RU')}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>


      {activTab === 'planed' && (
        <div className="modal-content">
          {tasksForDate.length > 0 ? (
            tasksForDate.map((task, index) => (
              <div key={index} className="task-section">
                <h3>{task.type}</h3>

                {Array.isArray(task.resources) && task.resources.length > 0 && (
                  <>
                    {task.type === 'Посев' &&
                      task.resources.map((res, i) => (
                        <div key={i} className="task-row">
                          <span>Количество посадочного материала:</span>
                          <span>{res.amountused} {res.unit}</span>
                        </div>
                      ))}

                    {task.type === 'Удобрение' &&
                      task.resources.map((res, i) => (
                        <div key={i}>
                          <div className="task-row">
                            <span>Дозировка:</span>
                            <span>{res.amountused} {res.unit}</span>
                          </div>
                          <div className="task-row">
                            <span>Тип удобрения:</span>
                            <span>{res.noteone}</span>
                          </div>
                          <div className="task-row">
                            <span>Способ внесения:</span>
                            <span>{res.notetwo}</span>
                          </div>
                        </div>
                      ))}

                    {task.type === 'Полив' &&
                      task.resources.map((res, i) => (
                        <div key={i}>
                          <div className="task-row">
                            <span>Объем воды:</span>
                            <span>{res.amountused} {res.unit}</span>
                          </div>
                          <div className="task-row">
                            <span>Метод полива:</span>
                            <span>{res.noteone}</span>
                          </div>
                        </div>
                      ))}
                  </>
                )}

                <div className="task-row">
                  <span>Время начала работы:</span>
                  <span>{new Date(task.plannedstartdatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="task-row">
                  <span>Время окончания работы:</span>
                  <span>{new Date(task.plannedenddatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-tasks">Нет задач на эту дату</div>
          )}
        </div>
      )}

      {activTab === 'fact' && (
        <div className="modal-content">
          {tasksForDate.length > 0 ? (
            tasksForDate.map((task, index) => {
              const taskActualUsages = actualUsages[task.workingId];
              const isLoading = loading[task.workingId];
              const isEdited = inputValues[task.workingId] !== undefined;

              return (
              <div key={index} className="task-section">
                <h3>{task.type}</h3>

                {isLoading ? (
                  <div className="loading">Загрузка...</div>
                ) : taskActualUsages ? (
                  <>
                    {task.type === 'Посев' &&
                      taskActualUsages.map((usage, i) => (
                        <div key={i} className="task-row">
                          <span>Количество посадочного материала:</span>
                          <span>{usage.amountActualUsed} {usage.unit}</span>
                        </div>
                      ))}

                    {task.type === 'Удобрение' &&
                      taskActualUsages.map((usage, i) => (
                        <div key={i}>
                          <div className="task-row">
                            <span>Дозировка:</span>
                            <span>{usage.amountActualUsed} {usage.unit}</span>
                          </div>
                        </div>
                      ))}

                    {task.type === 'Полив' &&
                      taskActualUsages.map((usage, i) => (
                        <div key={i}>
                          <div className="task-row">
                            <span>Объем воды:</span>
                            <span>{usage.amountActualUsed} {usage.unit}</span>
                          </div>
                        </div>
                      ))}
                  </>
                ) : isEdited ? (
                  <div className='fact-form'>
                    {task.resources.map((res, i) => (
                      <div key={i} className='from-row'>
                        <label>{res.name} ({res.unit}):
                        <InputSymbol type='number'
                        value={inputValues[task.workingId][res.resourceId] || ''}
                        onChange={(e) => handleInputChange(task.workingId, res.resourceId, e.target.value)}
                        placeholder={`Введите количество ${res.unit}`} />
                        </label>
                      </div>
                    ))}
              </div>
            ) : null}
            {taskActualUsages === null && (
              <Button className='add-fact-data'
                onClick={() => handleAddData(task)}
                disabled={isLoading}
                >
                  <span>{isEdited ? 'Отправить данные' : 'Добавить фактические данные'}</span>
                </Button>
            )}
              </div>
            )}
          )) : (
            <div className="no-tasks">Нет задач на эту дату</div>
          )}
        </div>
      )}
      </div>
    </div>
  )
}