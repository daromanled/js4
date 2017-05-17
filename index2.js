function collectDOMStat(root, res) {
    let arr = root.childNodes;
    if (!res){
        res = {
            tags: {},
            classes: {},
            texts: 0
        };
    }
    for (let x of arr) {
        if (x.nodeType === 3)
            res.texts++;
        else
        {
            res.tags[x.tagName] = (res.tags.hasOwnProperty(x.tagName)) ? res.tags[x.tagName] + 1 : 1;
            for (let i of x.classList)
                res.classes[i] = (res.classes.hasOwnProperty(i)) ? res.classes[i] + 1 : 1;
        }
        if (x.childNodes.length)
            collectDOMStat(x, res);
    }
    return res;
}

/**
 * *** Со звездочкой ***
 * Функция должна отслеживать добавление и удаление элементов внутри элемента where
 * Как только в where добавляются или удаляются элемента,
 * необходимо сообщать об этом при помощи вызова функции fn со специальным аргументом
 * В качестве аргумента должен быть передан объек с двумя свойствами:
 * - type: типа события (insert или remove)
 * - nodes: массив из удаленных или добавленных элементов (а зависимости от события)
 * Отслеживание должно работать вне зависимости от глубины создаваемых/удаляемых элементов
 * Рекомендуется использовать MutationObserver
 *
 * @param {Element} where - где отслеживать
 * @param {function(info: {type: string, nodes: Array<Element>})} fn - функция, которую необходимо вызвать
 *
 * @example
 * если в where или в одного из его детей добавляется элемент div
 * то fn должна быть вызвана с аргументов:
 * {
 *   type: 'insert',
 *   nodes: [div]
 * }
 *
 * ------
 *
 * если из where или из одного из его детей удаляется элемент div
 * то fn должна быть вызвана с аргументов:
 * {
 *   type: 'remove',
 *   nodes: [div]
 * }
 */
function observeChildNodes(where, fn) {
    let conf = {
        'childList': true,
        'subtree': true
    };
    let obs = new MutationObserver(function(records) {
        for (let record of records){
            let obj = {
                type: '',
                nodes: []
            };
            if (record.addedNodes.length)
            {
                obj = {
                    type: 'insert',
                    nodes: record.addedNodes
                };
            }
            else
                if (record.removedNodes.length)
                {
                    obj = {
                        type: 'remove',
                        nodes: record.removedNodes
                    };
                }
            fn(obj);
        }
        });
    obs.observe(where, conf);
}

export {
    collectDOMStat,
    observeChildNodes
};
