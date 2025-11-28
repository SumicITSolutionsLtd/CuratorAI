# CuratorAI Wardrobe System Analysis

## Executive Summary

This document provides a comprehensive line-by-line analysis of the wardrobe system, identifying the likely cause of the blank white screen issue and documenting all backend integrations, static data usage, and areas requiring connection to the backend.

---

## FIXES APPLIED (2024)

The following issues have been fixed:

| Issue                            | File                      | Status |
| -------------------------------- | ------------------------- | ------ |
| Date transformation crash        | `wardrobeSlice.ts`        | FIXED  |
| sortItems using mock data        | `WardrobePage.tsx`        | FIXED  |
| FilterDialog static data         | `FilterDialog.tsx`        | FIXED  |
| CreateOutfitPage not connected   | `CreateOutfitPage.tsx`    | FIXED  |
| OutfitRepository throwing errors | `OutfitRepository.ts`     | FIXED  |
| Image upload using base64        | `AddWardrobeItemPage.tsx` | FIXED  |

See "Section 11: Changes Made" for details.

---

## 1. ROOT CAUSE ANALYSIS: Blank White Screen

### Primary Suspect: `sortItems` Function Date Handling

**Location:** `src/presentation/pages/Wardrobe/WardrobePage.tsx:33` and `src/shared/mocks/wardrobeMockData.ts:844-862`

**Issue:** The `sortItems` function is imported from mock data and calls `.getTime()` on Date fields:

```typescript
// wardrobeMockData.ts:850-851
case 'date':
  return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
```

**Problem:** If the backend returns `createdAt`/`updatedAt` as ISO strings (e.g., `"2024-03-15T00:00:00Z"`) instead of JavaScript `Date` objects, this will throw:

```
TypeError: b.createdAt.getTime is not a function
```

This uncaught error would crash the entire component tree, resulting in a blank white screen.

### Secondary Suspect: User ID Not Available on Initial Render

**Location:** `src/presentation/pages/Wardrobe/WardrobePage.tsx:74-79`

```typescript
useEffect(() => {
  if (user?.id) {
    dispatch(fetchWardrobe(user.id))
    dispatch(fetchWardrobeStats(user.id))
  }
}, [dispatch, user?.id])
```

**Issue:** If `user` is null/undefined after session recovery, no API calls are made. Combined with:

- `isLoading: false` (initial state in wardrobeSlice:35)
- `items: []` (initial state)
- `error: null` (initial state)

The page would render but show the empty state, NOT a blank screen. However, if any subsequent operation throws, the screen goes blank.

### Verification Steps

1. Open browser DevTools Console
2. Navigate to `/wardrobe`
3. Look for JavaScript errors (especially TypeError related to `.getTime()`)
4. Check Network tab for 401/500 errors on `/wardrobe/users/{userId}/wardrobe/`

---

## 2. WARDROBE SYSTEM ARCHITECTURE

### File Structure

```
src/
├── domain/
│   ├── entities/
│   │   └── Wardrobe.ts              # Entity definitions
│   └── repositories/
│       └── IWardrobeRepository.ts   # Repository interface
├── infrastructure/
│   └── repositories/
│       └── WardrobeRepository.ts    # API implementation
├── presentation/
│   ├── pages/Wardrobe/
│   │   ├── WardrobePage.tsx         # Main wardrobe list
│   │   ├── WardrobeItemDetailPage.tsx
│   │   ├── AddWardrobeItemPage.tsx
│   │   └── CreateOutfitPage.tsx
│   └── components/wardrobe/
│       ├── FilterDialog.tsx          # Uses mock data!
│       └── SortMenu.tsx
└── shared/
    ├── store/slices/
    │   └── wardrobeSlice.ts         # Redux state management
    └── mocks/
        └── wardrobeMockData.ts      # Static mock data
```

---

## 3. BACKEND INTEGRATION STATUS

### Well-Integrated Endpoints

| Endpoint                                       | Repository Method      | Redux Action         | Status     |
| ---------------------------------------------- | ---------------------- | -------------------- | ---------- |
| `GET /wardrobe/users/{userId}/wardrobe/`       | `getWardrobe()`        | `fetchWardrobe`      | INTEGRATED |
| `GET /wardrobe/users/{userId}/wardrobe/stats/` | `getWardrobeStats()`   | `fetchWardrobeStats` | INTEGRATED |
| `POST /wardrobe/items/create/`                 | `addItem()`            | `addWardrobeItem`    | INTEGRATED |
| `PUT /wardrobe/items/{id}/update/`             | `updateItem()`         | `updateWardrobeItem` | INTEGRATED |
| `DELETE /wardrobe/items/{id}/delete/`          | `deleteItem()`         | `deleteWardrobeItem` | INTEGRATED |
| `POST /wardrobe/items/{id}/worn/`              | `incrementTimesWorn()` | `incrementTimesWorn` | INTEGRATED |
| `GET /wardrobe/items/{id}/`                    | `getItemById()`        | Not used             | AVAILABLE  |
| `POST /wardrobe/items/{id}/images/`            | `uploadItemImage()`    | Not used             | AVAILABLE  |

### Backend Response Expected Format

```typescript
// From WardrobeRepository.ts
interface Wardrobe {
  id: string
  userId: string
  name: string
  items: WardrobeItem[]
  totalItems: number
  categories: { tops; bottoms; shoes; accessories; outerwear; dresses }
  mostWornItem?: WardrobeItem
  createdAt: Date // ISSUE: Backend may return string
  updatedAt: Date // ISSUE: Backend may return string
}
```

---

## 4. STATIC DATA / MOCK DATA USAGE

### Critical: Still Using Mock Data

#### 1. FilterDialog.tsx (Line 20)

```typescript
import { getAllBrands, getAllColors } from '@/shared/mocks/wardrobeMockData'
```

**Impact:** Filter dropdown options come from static mock data, NOT from user's actual wardrobe items.
**Fix Required:** Derive brands/colors from actual `items` array in Redux state.

#### 2. WardrobePage.tsx (Line 33)

```typescript
import { sortItems } from '@/shared/mocks/wardrobeMockData'
```

**Impact:** Sorting function relies on Date objects, may crash if backend returns strings.
**Fix Required:** Move `sortItems` to utility file, add date conversion.

### Pages Using Mock Data with Backend Fallback

| Page          | Mock Data                      | Backend Integration | Status              |
| ------------- | ------------------------------ | ------------------- | ------------------- |
| WardrobePage  | `sortItems` function           | Full                | Partially Connected |
| FilterDialog  | `getAllBrands`, `getAllColors` | None                | Static Data         |
| CartPage      | `mockCartItems`                | `fetchCart`         | Fallback Pattern    |
| LookbooksPage | `mockLookbooks`                | `fetchLookbooks`    | Fallback Pattern    |

---

## 5. COMPONENTS NEEDING BACKEND CONNECTION

### 5.1 FilterDialog.tsx - HIGH PRIORITY

**Current State:** Imports brand/color lists from static mock data
**Location:** `src/presentation/components/wardrobe/FilterDialog.tsx:20`

```typescript
// CURRENT (static)
import { getAllBrands, getAllColors } from '@/shared/mocks/wardrobeMockData'

// SHOULD BE (dynamic)
const brands = useMemo(() => {
  const uniqueBrands = new Set(items.map((item) => item.brand).filter(Boolean))
  return Array.from(uniqueBrands)
}, [items])
```

**Required Changes:**

1. Accept `items` as a prop or access via Redux
2. Derive brands/colors dynamically from actual wardrobe items
3. Remove mock data import

### 5.2 CreateOutfitPage.tsx - HIGH PRIORITY

**Current State:** Uses simulated API call
**Location:** `src/presentation/pages/Wardrobe/CreateOutfitPage.tsx:110-121`

```typescript
// CURRENT (simulated)
setIsSubmitting(true)
await new Promise((resolve) => setTimeout(resolve, 1000))
toast({ title: 'Outfit Created' })
```

**Required Changes:**

1. Create `OutfitRepository` with `createOutfit()` method
2. Add `createOutfit` async thunk to Redux
3. Call backend endpoint (needs API specification)

### 5.3 AddWardrobeItemPage.tsx - MEDIUM PRIORITY

**Current State:** Basic form submits to backend via Redux
**Issue:** Image upload uses base64 data URLs, not actual file upload

**Location:** `src/presentation/pages/Wardrobe/AddWardrobeItemPage.tsx:65-76`

```typescript
// CURRENT (base64)
reader.readAsDataURL(file)
setImages((prev) => [...prev, reader.result as string])
```

**Required Changes:**

1. Implement proper image upload flow
2. Upload images first, get URLs back
3. Include image URLs in item creation payload

### 5.4 WardrobeItemDetailPage.tsx - LOW PRIORITY

**Current State:** Fully integrated with backend
**Minor Issue:** Edit button (line 175-177) has no functionality

```typescript
<Button variant="outline" size="icon">
  <Edit className="h-4 w-4" />
</Button>
```

**Required:** Navigate to edit page or open edit modal

---

## 6. DATA TRANSFORMATION ISSUES

### Date Field Handling

**Problem:** Backend likely returns dates as ISO strings, frontend expects Date objects.

**Locations Affected:**

1. `wardrobeMockData.ts:850-851` - `sortItems` calls `.getTime()`
2. `WardrobePage.tsx:40-41` - `formatLastWorn` creates Date from string
3. `WardrobeItemDetailPage.tsx:108-114` - `formatDate` creates Date from input

**Recommended Fix:** Add transformation in `wardrobeSlice.ts`:

```typescript
// In fetchWardrobe.fulfilled reducer
.addCase(fetchWardrobe.fulfilled, (state, action) => {
  state.isLoading = false
  state.wardrobe = action.payload
  // Transform date strings to Date objects
  state.items = action.payload.items.map(item => ({
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : undefined,
  }))
})
```

---

## 7. API ENDPOINT VERIFICATION

### From `docs/CuratorAI API.yaml`

| Endpoint                                           | Method | Description               | Used By                |
| -------------------------------------------------- | ------ | ------------------------- | ---------------------- |
| `/api/v1/wardrobe/items/`                          | GET    | List items with filtering | Not directly used      |
| `/api/v1/wardrobe/items/create/`                   | POST   | Add item                  | `addItem()`            |
| `/api/v1/wardrobe/items/{id}/`                     | GET    | Get single item           | `getItemById()`        |
| `/api/v1/wardrobe/items/{id}/update/`              | PUT    | Update item               | `updateItem()`         |
| `/api/v1/wardrobe/items/{id}/delete/`              | DELETE | Soft delete               | `deleteItem()`         |
| `/api/v1/wardrobe/items/{id}/images/`              | POST   | Upload image              | `uploadItemImage()`    |
| `/api/v1/wardrobe/items/{id}/worn/`                | POST   | Mark as worn              | `incrementTimesWorn()` |
| `/api/v1/wardrobe/users/{user_id}/wardrobe/`       | GET    | Get wardrobe              | `getWardrobe()`        |
| `/api/v1/wardrobe/users/{user_id}/wardrobe/stats/` | GET    | Get stats                 | `getWardrobeStats()`   |

### Missing Endpoints (Not in API spec)

1. **Create Outfit** - `POST /api/v1/outfits/create/` (needed for CreateOutfitPage)
2. **Edit Wardrobe Item Page** - UI route exists but no dedicated page

---

## 8. RECOMMENDED FIXES

### Immediate (Fix Blank Screen)

1. **Add Date Transformation** in `wardrobeSlice.ts`

```typescript
state.items = action.payload.items.map((item) => ({
  ...item,
  createdAt: new Date(item.createdAt),
  updatedAt: new Date(item.updatedAt),
}))
```

2. **Add Error Boundary** around WardrobePage

```typescript
<ErrorBoundary fallback={<WardrobeErrorFallback />}>
  <WardrobePage />
</ErrorBoundary>
```

### Short-term

3. **Refactor FilterDialog** to use dynamic data from items
4. **Move `sortItems`** to `src/shared/utils/wardrobeHelpers.ts`
5. **Add null checks** in sorting function

### Medium-term

6. **Implement CreateOutfit backend call**
7. **Add Edit Item functionality**
8. **Implement proper image upload flow**

---

## 9. TESTING CHECKLIST

- [ ] Login and navigate to `/wardrobe`
- [ ] Check console for errors
- [ ] Verify items load from backend
- [ ] Test sorting by each option (date, timesWorn, price, brand, name)
- [ ] Test filtering (should show actual brands from user's items)
- [ ] Test search functionality
- [ ] Test add new item flow
- [ ] Test item detail page
- [ ] Test delete item
- [ ] Test mark as worn
- [ ] Test create outfit flow

---

## 10. CONCLUSION

The blank white screen is most likely caused by the `sortItems` function calling `.getTime()` on date fields that are strings rather than Date objects. The fix requires adding date transformation when data is received from the backend.

Additionally, the FilterDialog component still uses static mock data for brand/color options, which should be refactored to use the actual items from the user's wardrobe.

The wardrobe system has good backend integration overall, but needs:

1. Date transformation on API responses
2. Dynamic filter options from actual data
3. Outfit creation endpoint integration
4. Proper image upload implementation

---

## 11. CHANGES MADE

### 11.1 Date Transformation Fix

**File:** `src/shared/store/slices/wardrobeSlice.ts`

Added transformation functions to convert ISO date strings to Date objects:

```typescript
const transformWardrobeItem = (item: any): WardrobeItem => ({
  ...item,
  createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
  updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
  purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : undefined,
})

const transformWardrobe = (wardrobe: any): Wardrobe => ({
  ...wardrobe,
  items: wardrobe.items?.map(transformWardrobeItem) || [],
  createdAt: wardrobe.createdAt ? new Date(wardrobe.createdAt) : new Date(),
  updatedAt: wardrobe.updatedAt ? new Date(wardrobe.updatedAt) : new Date(),
  mostWornItem: wardrobe.mostWornItem ? transformWardrobeItem(wardrobe.mostWornItem) : undefined,
})
```

Applied to all async thunks: `fetchWardrobe`, `addWardrobeItem`, `updateWardrobeItem`, `incrementTimesWorn`.

### 11.2 Sort Items Utility

**File:** `src/shared/utils/wardrobeHelpers.ts` (NEW)

Created a new utility file with safe date handling:

- `sortItems()` - Safe sorting with timestamp conversion
- `getBrandsFromItems()` - Extract unique brands from items
- `getColorsFromItems()` - Extract unique colors from items
- `getSeasonsFromItems()` - Extract unique seasons from items
- `filterItems()` - Filter items by criteria
- `searchItems()` - Search items by query

**File:** `src/presentation/pages/Wardrobe/WardrobePage.tsx`

Changed import from:

```typescript
import { sortItems } from '@/shared/mocks/wardrobeMockData'
```

To:

```typescript
import { sortItems } from '@/shared/utils/wardrobeHelpers'
```

### 11.3 FilterDialog Dynamic Data

**File:** `src/presentation/components/wardrobe/FilterDialog.tsx`

- Added `items` prop to receive wardrobe items
- Removed mock data import
- Brand/color/season options now derived from actual items:

```typescript
const brands = useMemo(() => getBrandsFromItems(items), [items])
const colors = useMemo(() => getColorsFromItems(items), [items])
const seasons = useMemo(() => {
  const itemSeasons = getSeasonsFromItems(items)
  const defaultSeasons = ['All Season', 'Spring', 'Summer', ...]
  return itemSeasons.length > 0 ? itemSeasons : defaultSeasons
}, [items])
```

**File:** `src/presentation/pages/Wardrobe/WardrobePage.tsx`

Updated FilterDialog call to pass items:

```typescript
<FilterDialog
  open={filterDialogOpen}
  onOpenChange={setFilterDialogOpen}
  onApply={handleFilterApply}
  currentFilters={filters}
  items={items}  // NEW
/>
```

### 11.4 OutfitRepository Implementation

**File:** `src/infrastructure/repositories/OutfitRepository.ts`

Implemented `createOutfit`, `updateOutfit`, `deleteOutfit` methods using correct API endpoints:

- Added `transformOutfit()` helper for backend response transformation
- Added `transformOutfitItems()` helper for item transformation
- `createOutfit()` - POST to `/outfits/` (uses `title` field, not `name`)
- `updateOutfit()` - PUT to `/outfits/{id}/`
- `deleteOutfit()` - DELETE to `/outfits/{id}/`
- `likeOutfit()` / `unlikeOutfit()` - POST to `/outfits/{id}/like/`
- `saveOutfit()` / `unsaveOutfit()` - POST to `/outfits/{id}/save/`

**Note:** API uses `title` instead of `name`, and items use `wardrobe_item_id` format.

### 11.5 CreateOutfitPage Integration

**File:** `src/presentation/pages/Wardrobe/CreateOutfitPage.tsx`

- Import `createOutfit` from Redux slice
- Import `OutfitItem` entity
- Updated `handleSubmit` to:
  - Transform wardrobe items to outfit items
  - Calculate total price
  - Dispatch `createOutfit` action
  - Handle errors properly

### 11.6 Image Upload Fix

**File:** `src/presentation/pages/Wardrobe/AddWardrobeItemPage.tsx`

- Changed from storing base64 strings to `ImageFile` objects (`{file: File, preview: string}`)
- Added proper image upload flow:
  1. Create item first (without images)
  2. Upload images to item via `uploadItemImage` endpoint
  3. Show upload progress to user
- Added cleanup of preview URLs to prevent memory leaks
- Added authentication check

---

## 12. NEW FILES CREATED

1. **`src/shared/utils/wardrobeHelpers.ts`**
   - Utility functions for wardrobe operations
   - Safe date handling in sorting

2. **`docs/MISSING_API_ENDPOINTS.md`**
   - Documentation of backend endpoints needed
   - Request/response format specifications
   - Priority levels for implementation

---

## 13. REMAINING WORK

### Backend Endpoints - ALL MAJOR ENDPOINTS AVAILABLE

After verification, **all major endpoints exist** in the API:

| Feature          | Endpoints                                       | Status    |
| ---------------- | ----------------------------------------------- | --------- |
| Outfits CRUD     | `/outfits/`, `/outfits/{id}/`                   | AVAILABLE |
| Outfit Like/Save | `/outfits/{id}/like/`, `/outfits/{id}/save/`    | AVAILABLE |
| Cart             | `/cart/{user_id}/`, `/cart/{user_id}/items/`    | AVAILABLE |
| Lookbooks        | `/lookbooks/create/`, `/lookbooks/{id}/update/` | AVAILABLE |
| Wardrobe         | All CRUD endpoints                              | AVAILABLE |

### Only 2 Endpoints Missing (Low Priority)

| Endpoint                        | Priority | Notes                           |
| ------------------------------- | -------- | ------------------------------- |
| `POST /outfits/{id}/feedback/`  | LOW      | Optional feature                |
| `GET /outfits/recommendations/` | MEDIUM   | Using `/outfits/` as workaround |

See `docs/MISSING_API_ENDPOINTS.md` for full endpoint listing.

### Frontend Work Remaining

- **CartPage.tsx** - Connect to available cart endpoints
- **LookbooksPage.tsx** - Connect to available lookbook endpoints
- **CartRepository.ts** - Create (endpoints exist in API)
- **LookbookRepository.ts** - Create (endpoints exist in API)
- Error boundary implementation for wardrobe pages
- Edit wardrobe item page/modal
