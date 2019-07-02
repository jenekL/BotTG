function getRemindsList() {
    const remindsList = [];

    remindsList.push({text: 'При приглашении к оператору', description: 'Вызов при приглашении к оператору'});
    remindsList.push({text: '60 минут', description: 'Оповещение за 60 минут до вызова'});
    remindsList.push({text: '30 минут', description: 'Оповещение за 30 минут до вызова'});
    remindsList.push({text: '15 минут', description: 'Оповещение за 15 минут до вызова'});
    remindsList.push({text: '10 минут', description: 'Оповещение за 10 минут до вызова'});

    return remindsList;
}

module.exports = getRemindsList;