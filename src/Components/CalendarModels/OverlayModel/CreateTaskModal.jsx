  import React, { useState } from 'react'
  import InputSymbol from '../../Input/InputSymbol/InputSymbol'
  import ButtonOverlay from '../../Button/ButtonOverlay/ButtonOverlay'
  import './OverlayModel.css'

  export default function CreateTaskModal({
    selectedDate,
    selectedValue,
    onClose,
    cultureId,
    greenhouseId,
    onRefreshEvents 
  }) {

    console.log('Получен greenhouseId в CreateTaskModal:', greenhouseId)
    
    const  [formData, setFormDate]= useState({
      amount: '',
      dose: '',
      type: '',
      method: '',
      volume: '',
      startTime: '',
      endTime: '',
    })


    const handleInputChange = (e) => {
      const {id, value} = e.target
      setFormDate(prev => ({ ...prev, [id]: value}))
    }

    const handleSalve = async () => {
      if (!greenhouseId) {
        console.error('Ошибка: greenhouseId не определен');
        return;
      }

      // const startDayTime = new Date(`${selectedDate}T${formData.startTime}:00`)
      // const endDayTime = new Date(`${selectedDate}T${formData.endTime}:00`)

    //Определяем тип работы ресурсы
    let typeId
    let resources = []

    switch(selectedValue) {
      case 'sowing':
          typeId = 1
          resources.push({
            name: 'Посадочный материал',
            noteOne: '',
            noteTwo: '',
            unitId: 2,
            amountUsed: parseFloat(formData.amount)
          })
          break

      case 'fertilizer':
          typeId = 3
          resources.push({
            name: 'Удобрение',
            noteOne: formData.type,
            noteTwo: formData.method,
            unitId: 2,
            amountUsed: parseFloat(formData.dose)
          })
          break

      case 'watering':
          typeId = 2
          resources.push({
            name: 'Вода',
            noteOne: formData.method,
            noteTwo: '',
            unitId: 1,
            amountUsed: parseFloat(formData.volume)
          })
          break

      default: return
    }


    function toUTCDate(dateStr, timeStr) {
      const [year, month, day] = dateStr.split('-').map(Number)
      const [hours, minutes] = timeStr.split(':').map(Number)

      const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0))

      return date.toISOString()
    }


    const plannedStart = toUTCDate(selectedDate, formData.startTime)
    const plannedEnd  = toUTCDate(selectedDate, formData.endTime)

    const requestData = { 
      cultureId,
      greenhouseNumber: greenhouseId,
      typeId,
      plannedStart,
      plannedEnd,
      resources
    }

    console.log('Отправка данных:', requestData)

    try {
      const response = await fetch('http://localhost:5180/api/workings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
      let errorMessage = 'Ошибка при создании задачи';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {}

      throw new Error(errorMessage);
    }

    if (onRefreshEvents) await onRefreshEvents();
    if (onClose) onClose(true);


    } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    }
  }

  console.log('Получен greenhouseId в CreateTaskModal:', greenhouseId)
  console.log('Тип greenhouseId:', typeof greenhouseId, greenhouseId)


    return (
      <div className='modal-overlay'>
        <div className='modal-overlay-creating-task'>
          <div className='modal-tile'>
            <span className='text size-text_title'>
              {selectedValue === 'sowing' && 'Добавление задачи посева'}
              {selectedValue === 'fertilizer' && 'Добавление задачи удобрения'}
              {selectedValue === 'watering' && 'Добавление задачи полива'}
            </span>
            <span className='text size-text_basic position'>Дата: {selectedDate}</span>

            <div className='date-container'>
              {/* Посев */}
              {selectedValue === 'sowing' && (
                <div className='container-input'>
                  <label htmlFor='count' className='caption'>Количество</label>
                  <InputSymbol id='amount' placeholder='Посадочного материала (кг)' type='number' 
                    value={formData.amount} onChange={handleInputChange}/>
                </div>
              )}

              {/* Удобрение */}
              {selectedValue === 'fertilizer' && (
                <>
                  <div className='container-input'>
                    <label htmlFor='dose' className='caption'>Дозировка</label>
                    <InputSymbol id='dose' placeholder='Дозировка (кг)' type='number' 
                    value={formData.dose} onChange={handleInputChange} />
                  </div>
                  <div className='container-input'>
                    <label htmlFor='type' className='caption'>Тип удобрения</label>
                    <InputSymbol id='type' placeholder='Тип удобрения' type='text'
                    value={formData.type} onChange={handleInputChange} />
                  </div>
                  <div className='container-input'>
                    <label htmlFor='method' className='caption'>Способ внесения</label>
                    <InputSymbol id='method' placeholder='Способ внесения' type='text'
                    value={formData.method} onChange={handleInputChange} />
                  </div>
                </>
              )}

              {/* Полив */}
              {selectedValue === 'watering' && (
                <>
                  <div className='container-input'>
                    <label htmlFor='volume' className='caption'>Объём воды</label>
                    <InputSymbol id='volume' placeholder='Объём воды (л)' type='number'
                    value={formData.volume} onChange={handleInputChange} />
                  </div>
                  <div className='container-input'>
                    <label htmlFor='method' className='caption'>Метод полива</label>
                    <InputSymbol id='method' placeholder='Метод полива' type='text'
                    value={formData.method} onChange={handleInputChange} />
                  </div>
                </>
              )}

              {/* Общее */}
              <div className='container-input'>
                <label htmlFor='startTime' className='caption'>Время начала</label>
                <InputSymbol id='startTime' type='time'
                value={formData.startTime} onChange={handleInputChange} />
              </div>
              <div className='container-input'>
                <label htmlFor='endTime' className='caption'>Время окончания</label>
                <InputSymbol id='endTime' type='time'
                value={formData.endTime} onChange={handleInputChange} />
              </div>
            </div>

            <div className='conteiner-button'>
              <ButtonOverlay className='button-blue' onClick={handleSalve}>Сохранить</ButtonOverlay>
              <ButtonOverlay className='button-red' onClick={() => onClose(false)}>Отмена</ButtonOverlay>
            </div>
          </div>
        </div>
      </div>
    )
  }
