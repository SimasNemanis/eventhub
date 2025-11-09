const generateUniqueId = () => { return ${Date.now()}-${Math.random().toString(36).substring(2, 9)}; };

const formatDate = (date) => { return new Date(date).toISOString().split('T')[0]; };

const calculateTimeDifference = (startTime, endTime) => { const [startHour, startMinute] = startTime.split(':').map(Number); const [endHour, endMinute] = endTime.split(':').map(Number);

const startMinutes = startHour * 60 + startMinute; const endMinutes = endHour * 60 + endMinute;

return endMinutes - startMinutes; };

const isTimeOverlap = (start1, end1, start2, end2) => { return ( (start1 >= start2 && start1 < end2) || (end1 > start2 && end1 <= end2) || (start1 <= start2 && end1 >= end2) ); };

module.exports = { generateUniqueId, formatDate, calculateTimeDifference, isTimeOverlap };