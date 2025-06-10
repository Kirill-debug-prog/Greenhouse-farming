import { useState, useEffect, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import './Calendar.css'
import SelectTaskTypeModal from '../OverlayModel/SelectTaskTypeModal.jsx'
import CreateTaskModal from '../OverlayModel/CreateTaskModal.jsx'
import EditTaskModal from '../OverlayModel/EditTaskModal.jsx'
import ActionModal from '../OverlayModel/ActionModal.jsx'
import DeleteModal from '../OverlayModel/DeleteModal.jsx'
import TaskDetailsModal from '../../CalendarModels/Details/TaskDetailsModal.jsx'
import { useRef } from 'react'


export default function Calendar({greenhouseId, token, cultureId, onRefreshEvents, onRefreshCalendar }) {
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false)
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false)
  const[actionModalOpen, setActionModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  // const [selectedValue, setSelectedValue] = useState('')
  const [taskTypeForCreate, setTasktaskTypeForCreate] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [events, setEvents] = useState([])
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [detailsDateTasks, setDetailsDateTasks] = useState([])
  const calendarRef = useRef(null)


  const fetchEvents = useCallback(async () => {
    if(!greenhouseId){
      setEvents([])
      return
    }

    try {
      const response = await fetch(`http://localhost:5180/api/workings/greenhouse/${greenhouseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Ошибка при получении данных')
      }

      const data = await response.json()
      console.log('Полученные события', data)

      const calendarEvents = data.map( item => ({
        id: item.workingid,
        title: item.type,
        typeClass: item.type.toLowerCase(),
        start: item.plannedstartdatetime,
        end: item.plannedenddatetime,
        extendedProps: {
          greenhouseName: item.greenhouseId,
          resources: item.resources
        }
      }))

      setEvents(calendarEvents)
      console.log('События для календаря', calendarEvents)
    } catch (error) {
      console.error('Ошибка при получении событий:', error)
      setEvents([])
    }
  }, [greenhouseId, token])

  useEffect(() => {
    fetchEvents()
  }, [taskTypeForCreate, fetchEvents])

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr)
    setIsFirstModalOpen(true);
    setActionModalOpen(true)
  };

   const handleNextButtonClick = () => {
    if (!selectedValue) return;

    setIsFirstModalOpen(false)
    setIsSecondModalOpen(true)
  }

  const handleEventBlockClick = (event) => {
    setSelectedEvent(event)
    setActionModalOpen(true)
    setSelectedDate(event.date)
  }

const handleDetailsClick = (e, dateStr) => {
  e.stopPropagation();
  setSelectedDate(dateStr);

  const filteredTasks = events.filter(event =>
    event.start.startsWith(dateStr)
  );

  const formattedTasks = filteredTasks.map(event => ({
  workingId: event.id,
  type: event.title,
  plannedstartdatetime: event.start,
  plannedenddatetime: event.end,
  resources: (event.extendedProps?.resources || []).map(res => ({
    resourceId: res.resourceId,
    amountused: res.amountused ?? res.amountUsed,
    unit: res.unit ?? res.unit,
    noteone: res.noteone ?? res.noteOne,
    notetwo: res.notetwo ?? res.noteTwo,
    name: res.resourceName
  }))
}));


  console.log('Formatted Tasks:', formattedTasks);

  setDetailsDateTasks(formattedTasks);
  setDetailsModalOpen(true);
};




  const closeModal = () => {
    setIsFirstModalOpen(false)
    setSelectedEvent(null)
    setIsSecondModalOpen(false)
    setActionModalOpen(false)
  };

  const renderDayCell = (cellInfo) => {
    const dateStr = cellInfo.date.toISOString().split('T')[0]
    const dayEvents = events.filter(ev => ev.start.startsWith(dateStr))

    return (
      <div  className='day-cell'>
        <div className='day-number' onClick={() => handleDateClick({dateStr})}>{cellInfo.dayNumberText}</div>

        <div className='conteiner-color-block'>
          {/* Цветовые блоки по событиям */}
          {dayEvents.map((ev, index) => (
          <div key={index} className={`color-block ${ev.typeClass}`} onClick={() => handleEventBlockClick(ev)}></div>
        ))}
        </div>
        
        <div className='details-button-container'>
          {dayEvents.length > 0 && (
        <button
          type='button'
          className='details-button'
          onClick={(e) => handleDetailsClick(e, dateStr)}
        >
          Детали
        </button>
      )}
        </div>
      </div>
    )
  };

  console.log('Получен greenhouseId:', greenhouseId)
  console.log('Передаём greenhouseId в CreateTaskModal:', greenhouseId)


  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ru"
        firstDay={1}
        height="auto"
        dayCellContent={renderDayCell}
        timeZone="UTC"
        events={events}
      />

    {/* Выбор задачи */}
      {isFirstModalOpen && (
      <SelectTaskTypeModal
        selectedDate={selectedDate}
        cultureId={cultureId}
        greenhouseId={greenhouseId}
        onClose={closeModal}
        onNext={(value) =>{
          setTasktaskTypeForCreate(value)
          setIsFirstModalOpen(false)
        }}
      />
    )}


    {taskTypeForCreate && (
      <CreateTaskModal
        selectedDate={selectedDate}
        selectedValue={taskTypeForCreate}
        cultureId={cultureId}
        greenhouseId={greenhouseId}
        onClose={async (success) => {
            if (success) {
              await fetchEvents();
            }
          
            setIsFirstModalOpen(false);
            setTasktaskTypeForCreate(null);
          }}
        onRefreshEvents={onRefreshCalendar}
      />
    )}



     <ActionModal
        isOpen={actionModalOpen && selectedEvent}
        selectedDate={selectedDate}
        selectedEvent={selectedEvent}
        onEdit={() => {
          setActionModalOpen(false)
          setEditModalOpen(true)
        }}
        onDelete={() => {
          setActionModalOpen(false)
          setDeleteModalOpen(true)
        }}
        onClose={closeModal}
      />

      <DeleteModal
        isOpen={deleteModalOpen && selectedEvent}
        selectedEvent={selectedEvent}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedEvent(null)
        }}
      />


      {/* Редактирование графика */}
      {editModalOpen && selectedEvent && (
        <EditTaskModal
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
          onClose={() => {
            closeModal()
            setSelectedEvent(null)
            setEditModalOpen(false)
          }}
          onSave={() => {
            // логика обновления
            closeModal()
            setSelectedEvent(null)
            setEditModalOpen(false)
          }}
        />
      )}

      {detailsModalOpen && (
        <TaskDetailsModal
          date={selectedDate}
          tasks={detailsDateTasks}
          onClose={() => setDetailsModalOpen(false)}
        />
      )}
    </>
  );
}