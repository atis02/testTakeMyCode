// const { Data } = require("../models/model");
// const ApiError = require("../error/apiError");
// const { Sequelize } = require("sequelize");
// const sequelize = require("../db");

// let sortOrder = "ASC";
// let selectedItems = [];
// class DataController {
//   async createTestData(req, res, next) {
//     try {
//       const testData = [];
//       for (let i = 1; i <= 1000; i++) {
//         //можно потом изменить цифры на 100 000
//         testData.push({ value: i, position: i });
//       }

//       await Data.bulkCreate(testData);
//       return res.json({ message: "Test data successfully created!" });
//     } catch (error) {
//       return next(ApiError.internal("Failed to create test data", error));
//     }
//   }
//   //   async getTestData(req, res, next) {
//   //     const {
//   //       page = 1,
//   //       search = "",
//   //       sortBy = "value",
//   //       order = "ASC",
//   //     } = req.query;
//   //     const limit = 20;
//   //     const offset = (page - 1) * limit;
//   //     try {
//   //       const searchCondition = search
//   //         ? { [Sequelize.Op.iLike]: `%${search}%` }
//   //         : {};
//   //       const data = await Data.findAndCountAll({
//   //         where: {
//   //           value: searchCondition,
//   //         },
//   //         order: [[sortBy, order]],
//   //         limit: limit,
//   //         offset: offset,
//   //       });

//   //       return res.json({
//   //         data: data.rows,
//   //         total: data.count,
//   //         page: page,
//   //         totalPages: Math.ceil(data.count / limit),
//   //       });
//   //     } catch (error) {
//   //       console.error(error); // Логируем ошибку для диагностики
//   //       return next(ApiError.internal("Error fetching data", error));
//   //     }

//   //     // try {
//   //     //   const data = await Data.findAndCountAll({
//   //     //     where: {
//   //     //       value: {
//   //     //         [Sequelize.Op.iLike]: `%${search}%`, // Фильтрация по значению (с использованием оператора LIKE для поиска)
//   //     //       },
//   //     //     },
//   //     //     order: [[sortBy, order]], // Сортировка по указанному столбцу и порядку
//   //     //     limit: limit, // Пагинация - ограничение на 20 элементов
//   //     //     offset: offset, // Смещение для пагинации
//   //     //   });

//   //     //   return res.json({
//   //     //     data: data.rows,
//   //     //     total: data.count, // Общее количество элементов, для вычисления страниц
//   //     //     page: page,
//   //     //     totalPages: Math.ceil(data.count / limit),
//   //     //   });
//   //     // } catch (error) {
//   //     //   return next(ApiError.internal("Error fetching data", error));
//   //     // }
//   //   }

//   async getTestData(req, res, next) {
//     const {
//       page = 1,
//       search = "", // По умолчанию пустое значение
//       sortBy = "value",
//       order = "ASC",
//       selected = [],
//     } = req.query;

//     const limit = 20;
//     const offset = (page - 1) * limit;
//     sortOrder = order;
//     selectedItems = selected;
//     try {
//       // Если search не пустой, создаем условие для поиска по числовому значению
//       const whereCondition = search
//         ? { value: { [Sequelize.Op.eq]: Number(search) } } // Точное совпадение с числом
//         : {}; // Если search пустой, то условие не применяется, и выберутся все элементы

//       const data = await Data.findAndCountAll({
//         where: whereCondition, // Условие для фильтрации
//         order: [[sortBy, sortOrder]], // Сортировка
//         limit: limit, // Пагинация - ограничение на 20 элементов
//         offset: offset, // Смещение для пагинации
//       });

//       return res.json({
//         data: data.rows, // Возвращаем данные
//         total: data.count, // Общее количество записей
//         page: page, // Текущая страница
//         totalPages: Math.ceil(data.count / limit),
//         selected: selectedItems, // Выбранные элементы
//         sortOrder,
//       });
//     } catch (error) {
//       console.error(error); // Логируем ошибку
//       return next(ApiError.internal("Error fetching data", error)); // Обработка ошибки
//     }
//   }
//   //   async updateSortOrder(req, res, next) {
//   //     const { newOrder } = req.body; // Получаем новый порядок элементов
//   //     console.log("Received new order:", newOrder);
//   //     try {
//   //       // Сохраняем новый порядок сортировки на сервере
//   //       await sequelize.transaction(async (t) => {
//   //         for (const item of newOrder) {
//   //           console.log(
//   //             `Updating item with id ${item.id} to position ${item.position}`
//   //           );
//   //           const updated = await Data.update(
//   //             { position: item.position }, // Обновляем позицию
//   //             { where: { id: item.id }, transaction: t } // Для каждого элемента с данным id
//   //           );
//   //           if (updated[0] === 0) {
//   //             console.log(`No rows updated for item with id ${item.id}`);
//   //           }
//   //         }
//   //       });
//   //       return res.json({ message: "Sort order updated" });
//   //     } catch (error) {
//   //       console.error(error); // Логируем ошибку
//   //       return next(ApiError.internal("Error updating sort order", error));
//   //     }
//   //   }
//   async updateSortOrder(req, res, next) {
//     const { newOrder } = req.body; // Получаем новый порядок элементов

//     // Подготовка списка измененных элементов
//     const updatedItems = newOrder.filter(
//       (item) => item.position !== item.oldPosition
//     );

//     if (updatedItems.length === 0) {
//       return res.json({ message: "No changes detected" });
//     }

//     try {
//       // Сохраняем новый порядок сортировки в базе данных с использованием транзакций
//       await sequelize.transaction(async (t) => {
//         // Обновляем элементы пакетами по 100 (например)
//         const chunkSize = 100;
//         for (let i = 0; i < updatedItems.length; i += chunkSize) {
//           const chunk = updatedItems.slice(i, i + chunkSize);

//           const updatePromises = chunk.map((item) =>
//             Data.update(
//               { position: item.position }, // Обновляем позицию
//               { where: { id: item.id }, transaction: t }
//             )
//           );

//           await Promise.all(updatePromises); // Ждем завершения всех обновлений
//         }
//       });

//       return res.json({ message: "Sort order updated successfully" });
//     } catch (error) {
//       console.error(error); // Логируем ошибку
//       return next(ApiError.internal("Error updating sort order", error));
//     }
//   }

//   async updateSelectedItems(req, res, next) {
//     const { selected } = req.body; // Получаем массив выбранных элементов

//     try {
//       // Сохраняем выбранные элементы на сервере
//       selectedItems = selected; // Обновляем массив выбранных элементов
//       return res.json({ message: "Selected items updated" });
//     } catch (error) {
//       console.error(error); // Логируем ошибку
//       return next(ApiError.internal("Error updating selected items", error));
//     }
//   }
// }

// module.exports = new DataController();
const ApiError = require("../error/apiError");

let data = [];
const totalData = 1000000; // Максимальное количество данных
function generateRandomText(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
// Инициализация данных от 0 до 1000000
for (let i = 1; i <= totalData; i++) {
  data.push({
    id: i,
    value: generateRandomText(5),
    position: i,
    selected: false,
  });
}

let sortOrder = "ASC";
let selectedItems = [];

class DataController {
  // Генерация тестовых данных
  async createTestData(req, res, next) {
    try {
      return res.json({ message: "Test data successfully created!" });
    } catch (error) {
      return next(ApiError.internal("Failed to create test data", error));
    }
  }

  // Получение данных с пагинацией, фильтрацией, сортировкой и сохранением выбранных элементов
  async getTestData(req, res, next) {
    const {
      page = 1,
      search = "",
      sortBy = "value",
      order = "ASC",
      selected = [],
    } = req.query;

    const limit = 20;
    const offset = (page - 1) * limit;

    sortOrder = order;
    selectedItems = selected;

    try {
      // Фильтрация по поисковому запросу
      const filteredData = data.filter((item) =>
        item.value.toString().includes(search)
      );

      // Сортировка
      const sortedData = filteredData.sort((a, b) => {
        if (sortBy === "value") {
          return sortOrder === "ASC" ? a.value - b.value : b.value - a.value;
        }
        return 0;
      });

      // Разбиение на страницы
      const paginatedData = sortedData.slice(offset, offset + limit);

      return res.json({
        data: paginatedData,
        total: filteredData.length,
        page: page,
        totalPages: Math.ceil(filteredData.length / limit),
        selected: selectedItems,
        sortOrder,
      });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Error fetching data", error));
    }
  }

  // Обновление выбранных элементов
  async updateSelectedItems(req, res, next) {
    const { selected } = req.body; // The selected ids sent from the frontend

    try {
      // Iterate over your data and update the 'selected' field
      data.forEach((item) => {
        if (selected.includes(item.id)) {
          item.selected = true; // Set selected to true for matching ids
        }
      });

      return res.json({ message: "Selected items updated successfully", data });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Error updating selected items", error));
    }
  }

  // Обновление порядка сортировки

  // async updateSortOrder(req, res, next) {
  //   const { newOrder } = req.body; // Новый порядок элементов

  //   const updatedItems = newOrder.filter(
  //     (item) => item.position !== item.oldPosition
  //   );

  //   if (updatedItems.length === 0) {
  //     return res.json({ message: "No changes detected" });
  //   }

  //   try {
  //     // Обновляем порядок элементов в массиве
  //     updatedItems.forEach((item) => {
  //       const index = data.findIndex((d) => d.id === item.id);
  //       if (index !== -1) {
  //         // Если элемент перемещен на более высокую позицию
  //         if (item.position < item.oldPosition) {
  //           // Смещаем все элементы, чьи позиции больше новой
  //           data.forEach((d) => {
  //             if (
  //               d.position >= item.position &&
  //               d.position < item.oldPosition
  //             ) {
  //               d.position++; // Сдвигаем их на одну позицию вниз
  //             }
  //           });
  //         }
  //         // Если элемент перемещен на более низкую позицию
  //         else if (item.position > item.oldPosition) {
  //           // Смещаем все элементы, чьи позиции меньше новой
  //           data.forEach((d) => {
  //             if (
  //               d.position <= item.position &&
  //               d.position > item.oldPosition
  //             ) {
  //               d.position--; // Сдвигаем их на одну позицию вверх
  //             }
  //           });
  //         }

  //         // Обновляем позицию перемещаемого элемента
  //         data[index].position = item.position;
  //       }
  //     });

  //     return res.json({ message: "Sort order updated successfully" });
  //   } catch (error) {
  //     console.error(error);
  //     return next(ApiError.internal("Error updating sort order", error));
  //   }
  // }
  async updateSortOrder(req, res, next) {
    const { newOrder } = req.body; // New order received from the frontend

    const updatedItems = newOrder.filter(
      (item) => item.position !== item.oldPosition // Find changed items
    );

    if (updatedItems.length === 0) {
      return res.json({ message: "No changes detected" });
    }

    try {
      // Update the order of items
      updatedItems.forEach((item) => {
        const index = data.findIndex((d) => d.id === item.id);
        if (index !== -1) {
          // If the item has moved to a higher position
          if (item.position < item.oldPosition) {
            // Shift all items whose position is greater than the new one
            data.forEach((d) => {
              if (
                d.position >= item.position &&
                d.position < item.oldPosition
              ) {
                d.position++; // Move them one step down
              }
            });
          }
          // If the item has moved to a lower position
          else if (item.position > item.oldPosition) {
            // Shift all items whose position is less than the new one
            data.forEach((d) => {
              if (
                d.position <= item.position &&
                d.position > item.oldPosition
              ) {
                d.position--; // Move them one step up
              }
            });
          }

          // Update the position of the moved item
          data[index].position = item.position;
        }
      });

      return res.json({ message: "Sort order updated successfully" });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Error updating sort order", error));
    }
  }
}

module.exports = new DataController();
