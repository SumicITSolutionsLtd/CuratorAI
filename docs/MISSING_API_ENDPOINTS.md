# API Endpoints Status

This document outlines the API endpoint availability based on `docs/CuratorAI API.yaml`.

---

## AVAILABLE ENDPOINTS

### Outfits (All Available)

| Endpoint                          | Method | Description        |
| --------------------------------- | ------ | ------------------ |
| `/api/v1/outfits/`                | GET    | List outfits       |
| `/api/v1/outfits/`                | POST   | Create outfit      |
| `/api/v1/outfits/{id}/`           | GET    | Get outfit details |
| `/api/v1/outfits/{id}/`           | PUT    | Update outfit      |
| `/api/v1/outfits/{id}/`           | DELETE | Delete outfit      |
| `/api/v1/outfits/{id}/like/`      | POST   | Like/unlike outfit |
| `/api/v1/outfits/{id}/save/`      | POST   | Save/unsave outfit |
| `/api/v1/outfits/user/{user_id}/` | GET    | Get user outfits   |

### Cart (All Available)

| Endpoint                                         | Method | Description        |
| ------------------------------------------------ | ------ | ------------------ |
| `/api/v1/cart/{user_id}/`                        | GET    | Get user cart      |
| `/api/v1/cart/{user_id}/clear/`                  | DELETE | Clear cart         |
| `/api/v1/cart/{user_id}/items/`                  | POST   | Add to cart        |
| `/api/v1/cart/{user_id}/items/{item_id}/`        | PATCH  | Update cart item   |
| `/api/v1/cart/{user_id}/items/{item_id}/remove/` | DELETE | Remove from cart   |
| `/api/v1/cart/{user_id}/promo/`                  | POST   | Apply promo code   |
| `/api/v1/cart/{user_id}/promo/remove/`           | DELETE | Remove promo code  |
| `/api/v1/cart/shipping/calculate/`               | POST   | Calculate shipping |

### Lookbooks (All Available)

| Endpoint                                    | Method | Description            |
| ------------------------------------------- | ------ | ---------------------- |
| `/api/v1/lookbooks/`                        | GET    | List lookbooks         |
| `/api/v1/lookbooks/create/`                 | POST   | Create lookbook        |
| `/api/v1/lookbooks/{id}/`                   | GET    | Get lookbook details   |
| `/api/v1/lookbooks/{id}/update/`            | PUT    | Update lookbook        |
| `/api/v1/lookbooks/{id}/delete/`            | DELETE | Delete lookbook        |
| `/api/v1/lookbooks/{lookbook_id}/like/`     | POST   | Like lookbook          |
| `/api/v1/lookbooks/{lookbook_id}/comments/` | GET    | Get comments           |
| `/api/v1/lookbooks/featured/`               | GET    | Get featured lookbooks |

### Wardrobe (All Available)

| Endpoint                                           | Method | Description        |
| -------------------------------------------------- | ------ | ------------------ |
| `/api/v1/wardrobe/users/{user_id}/wardrobe/`       | GET    | Get user wardrobe  |
| `/api/v1/wardrobe/users/{user_id}/wardrobe/stats/` | GET    | Get wardrobe stats |
| `/api/v1/wardrobe/items/`                          | GET    | List items         |
| `/api/v1/wardrobe/items/create/`                   | POST   | Create item        |
| `/api/v1/wardrobe/items/{id}/`                     | GET    | Get item details   |
| `/api/v1/wardrobe/items/{id}/update/`              | PUT    | Update item        |
| `/api/v1/wardrobe/items/{id}/delete/`              | DELETE | Delete item        |
| `/api/v1/wardrobe/items/{item_id}/images/`         | POST   | Upload image       |
| `/api/v1/wardrobe/items/{item_id}/worn/`           | POST   | Mark as worn       |

---

## MISSING ENDPOINTS

Only 2 endpoints are not available in the API spec:

### 1. Outfit Feedback (Optional)

**Endpoint:** `POST /api/v1/outfits/{id}/feedback/`

**Description:** Provide feedback on an outfit recommendation.

**Request Body:**

```json
{
  "helpful": true,
  "feedback": "Great suggestion!"
}
```

**Priority:** LOW - Not critical for core functionality.

### 2. Outfit Recommendations (Optional)

**Endpoint:** `GET /api/v1/outfits/recommendations/`

**Description:** Get AI-powered outfit recommendations.

**Query Parameters:**

- `occasion` - Filter by occasion
- `styles` - Filter by styles
- `season` - Filter by season
- `page`, `limit` - Pagination

**Current Workaround:** Using `GET /api/v1/outfits/` with filters.

**Priority:** MEDIUM - Would enhance personalization.

---

## FRONTEND INTEGRATION STATUS

All major features now have backend support:

| Feature        | Status            | Notes               |
| -------------- | ----------------- | ------------------- |
| Wardrobe CRUD  | INTEGRATED        | Full support        |
| Outfit CRUD    | INTEGRATED        | Full support        |
| Cart           | NEEDS INTEGRATION | Endpoints available |
| Lookbooks      | NEEDS INTEGRATION | Endpoints available |
| Social/Feed    | INTEGRATED        | Full support        |
| Authentication | INTEGRATED        | Full support        |

---

## ACTION ITEMS

### Frontend Work Needed

1. **CartPage.tsx** - Connect to cart endpoints (endpoints exist)
2. **LookbooksPage.tsx** - Connect to lookbook endpoints (endpoints exist)
3. **CartRepository.ts** - Create repository for cart operations
4. **LookbookRepository.ts** - Create repository for lookbook operations
