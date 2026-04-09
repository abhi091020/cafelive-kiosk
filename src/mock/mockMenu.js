// src/mock/mockMenu.js
// Shape mirrors the new /food-allocation/getDayWiseFoodAllocationByDate/{date}/{shiftId} response.
// Used only for dev/testing — real data always comes from the API.

const mockMenu = {
  mealTypes: [
    {
      mealTypeId: 1,
      menus: [
        {
          menuId: 1,
          items: [
            {
              itemId: 1,
              itemEnglishName: "Poha",
              itemHindiName: "पोहा",
              itemMarathiName: "पोहे",
            },
            {
              itemId: 2,
              itemEnglishName: "Upma",
              itemHindiName: "उपमा",
              itemMarathiName: "उपमा",
            },
            {
              itemId: 3,
              itemEnglishName: "Dal Rice",
              itemHindiName: "दाल चावल",
              itemMarathiName: "डाळ भात",
            },
          ],
        },
      ],
    },
    {
      mealTypeId: 2,
      menus: [
        {
          menuId: 2,
          items: [
            {
              itemId: 4,
              itemEnglishName: "Samosa",
              itemHindiName: "समोसा",
              itemMarathiName: "समोसा",
            },
            {
              itemId: 5,
              itemEnglishName: "Vada Pav",
              itemHindiName: "वड़ा पाव",
              itemMarathiName: "वडापाव",
            },
          ],
        },
      ],
    },
    {
      mealTypeId: 3,
      menus: [
        {
          menuId: 3,
          items: [
            {
              itemId: 6,
              itemEnglishName: "Masala Chai",
              itemHindiName: "मसाला चाय",
              itemMarathiName: "मसाला चहा",
            },
            {
              itemId: 7,
              itemEnglishName: "Filter Coffee",
              itemHindiName: "फिल्टर कॉफी",
              itemMarathiName: "फिल्टर कॉफी",
            },
          ],
        },
      ],
    },
  ],
};

export default mockMenu;
