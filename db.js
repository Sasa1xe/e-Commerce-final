// import fs from "fs/promises";
// import path from "path";

// const dbPath = path.join(import.meta.dirname, "data.json");

// export function createDB() {
//   return {
//     //get By Id
//     async getById(resource, id) {
//       //1. Read DB file from disk
//       const data = await fs.readFile(dbPath, { encoding: "utf-8" });
//       // 2. Parse JSON string -> JS obj
//       const json = JSON.parse(data);
//       // 3. Search resource arr, match id (string compare), return match or undefined
//       return json[resource].find((x) => String(x.id) === String(id));
//     },

//     //Get One
//     async getOne(resource, query) {
//       const data = await fs.readFile(dbPath, { encoding: "utf-8" });
//       const json = JSON.parse(data);
//       return json[resource].find((x) => {
//         return Object.keys(query).every(
//           (key) => String(x[key]) === String(query[key]),
//         );
//       });
//     },

//     //Get all data
//     async getAll(resource) {
//       // 1. Read DB file from disk
//       const data = await fs.readFile(dbPath, { encoding: "utf-8" });
//       // 2. Parse JSON string -> JS obj
//       const json = JSON.parse(data);
//       // 3. Return full resource arr
//       return json[resource];
//     },

//     //Create
//     async create(resource, obj) {
//       // 1. Read raw DB file from disk
//       const data = await fs.readFile(dbPath, { encoding: "utf-8" });
//       // 2. Turn JSON string into JS object
//       const json = JSON.parse(data);
//       // 3. Clone payload and attach unique ID
//       const newObj = { ...obj, id: getId() };
//       // 4. Push new object into target resource array
//       const newResource = [...json[resource], newObj];
//       // 5. Update full DB object with new resource array
//       const newData = {
//         ...json,
//         [resource]: newResource,
//       };
//       // 6. Save updated DB object back to file
//       await fs.writeFile(dbPath, JSON.stringify(newData));
//       // 7. Return new object with generated ID
//       return newObj;
//     },

//     //Update
//     async update(resource, id, updates) {
//       // 1. Read DB file from disk
//       const data = await fs.readFile(dbPath, { encoding: "utf-8" });
//       // 2. Parse JSON string -> JS obj
//       const json = JSON.parse(data);

//       //--------------Going through the User's Array and Updating it-------------------
//       // 3. Map over resource arr: id matches updates -> id no match keep as-is
//       const newResource = json[resource].map((x) => {
//         if (x.id != id) {
//           //  if the ID matches : don't change
//           return x;
//         } else {
//           return {
//             ...x,
//             ...updates,
//             id: x.id, // keep orig id, block overwrite via updates
//           };
//         }
//       });
//       //-------------------------------------------------------------------------------

//       // 4. Rebuild full DB obj w updated resource arr
//       const newData = {
//         ...json,
//         [resource]: newResource,
//       };
//       // 5. Save back to file (no return val)
//       await fs.writeFile(dbPath, JSON.stringify(newData));
//     },

//     //Delete
//     async delete(resource, id) {
//       // 1. Read DB file from disk
//       const data = await fs.readFile(dbPath, { encoding: "utf-8" });
//       // 2. Parse JSON string -> JS obj
//       const json = JSON.parse(data);
//       // 3. Filter out item w matching id (loose compare)
//       const newResource = json[resource].filter((x) => x.id != id);

//       // 4. Rebuild full DB obj w filtered resource arr
//       const newData = {
//         ...json,
//         [resource]: newResource,
//       };

//       // 5. Save back to file (no return val)
//       await fs.writeFile(dbPath, JSON.stringify(newData));
//     },
    
//     async raw() {
//       const data = await fs.readFile(dbPath, { encoding: "utf-8" });
//       return JSON.parse(data);
//     },
//   };
// }


// function getId() {
//   // Gen random id string, 0–9999999 range
//   return String(Math.floor(Math.random() * 10000000));
// }



import fs from "fs/promises";
import path from "path";

const dbPath = path.join(import.meta.dirname, "data.json");

export function createDB() {
  return {
    async getOne(resource, query) {
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      const json = JSON.parse(data);
      return json[resource].find((x) => {
        return Object.keys(query).every(
          (key) => String(x[key]) === String(query[key]),
        );
      });
    },
    //get By Id
    async getById(resource, id) {
      //1. Read DB file from disk
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      // 2. Parse JSON string -> JS obj
      const json = JSON.parse(data);
      // 3. Search resource arr, match id (string compare), return match or undefined
      return json[resource].find((x) => String(x.id) === String(id));
    },

    //Get all data
    async getAll(resource) {
      // 1. Read DB file from disk
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      // 2. Parse JSON string -> JS obj
      const json = JSON.parse(data);
      // 3. Return full resource arr
      return json[resource];
    },

    //Create
    async create(resource, obj) {
      // 1. Read raw DB file from disk
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      // 2. Turn JSON string into JS object
      const json = JSON.parse(data);
      // 3. Clone payload and attach unique ID
      const newObj = { ...obj, id: getId() };
      // 4. Push new object into target resource array
      const newResource = [...json[resource], newObj];
      // 5. Update full DB object with new resource array
      const newData = {
        ...json,
        [resource]: newResource,
      };
      // 6. Save updated DB object back to file
      await fs.writeFile(dbPath, JSON.stringify(newData));
      // 7. Return new object with generated ID
      return newObj;
    },

    //Update
    async update(resource, id, updates) {
      // 1. Read DB file from disk
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      // 2. Parse JSON string -> JS obj
      const json = JSON.parse(data);

      //--------------Going through the User's Array and Updating it-------------------
      // 3. Map over resource arr: id matches updates -> id no match keep as-is
      const newResource = json[resource].map((x) => {
        if (x.id != id) {
          //  if the ID matches : don't change
          return x;
        } else {
          return {
            ...x,
            ...updates,
            id: x.id, // keep orig id, block overwrite via updates
          };
        }
      });
      //-------------------------------------------------------------------------------

      // 4. Rebuild full DB obj w updated resource arr
      const newData = {
        ...json,
        [resource]: newResource,
      };
      // 5. Save back to file (no return val)
      await fs.writeFile(dbPath, JSON.stringify(newData));
    },

    //Delete
    async delete(resource, id) {
      // 1. Read DB file from disk
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      // 2. Parse JSON string -> JS obj
      const json = JSON.parse(data);
      // 3. Filter out item w matching id (loose compare)
      const newResource = json[resource].filter((x) => x.id != id);

      // 4. Rebuild full DB obj w filtered resource arr
      const newData = {
        ...json,
        [resource]: newResource,
      };

      // 5. Save back to file (no return val)
      await fs.writeFile(dbPath, JSON.stringify(newData));
    },
  };
}

function getId() {
  // Gen random id string, 0–9999999 range
  return String(Math.floor(Math.random() * 10000000));
}
