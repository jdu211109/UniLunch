// src/components/meals/MealFilters.jsx
import React from "react";
import { Leaf, Flame, X } from "lucide-react";
import { Button, Checkbox, Label, Badge, Input } from "../ui";

export default function MealFilters({
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
  isFilterMenuOpen,
  setIsFilterMenuOpen,
//   favoriteMealIds
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1 hidden">
          <Input
            placeholder="Filter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.5 3C4.67157 3 4 3.67157 4 4.5C4 5.32843 4.67157 6 5.5 6C6.32843 6 7 5.32843 7 4.5C7 3.67157 6.32843 3 5.5 3ZM3 5C3.01671 5 3.03323 4.99918 3.04952 4.99758C3.28022 6.1399 4.28967 7 5.5 7C6.71033 7 7.71978 6.1399 7.95048 4.99758C7.96677 4.99918 7.98329 5 8 5H13.5C13.7761 5 14 4.77614 14 4.5C14 4.22386 13.7761 4 13.5 4H8C7.98329 4 7.96677 4.00082 7.95048 4.00242C7.71978 2.86009 6.71033 2 5.5 2C4.28967 2 3.28022 2.86009 3.04952 4.00242C3.03323 4.00082 3.01671 4 3 4H1.5C1.22386 4 1 4.22386 1 4.5C1 4.77614 1.22386 5 1.5 5H3ZM11.9505 10.9976C11.7198 12.1399 10.7103 13 9.5 13C8.28967 13 7.28022 12.1399 7.04952 10.9976C7.03323 10.9992 7.01671 11 7 11H1.5C1.22386 11 1 10.7761 1 10.5C1 10.2239 1.22386 10 1.5 10H7C7.01671 10 7.03323 10.0008 7.04952 10.0024C7.28022 8.8601 8.28967 8 9.5 8C10.7103 8 11.7198 8.8601 11.9505 10.0024C11.9668 10.0008 11.9833 10 12 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H12C11.9833 11 11.9668 10.9992 11.9505 10.9976ZM8 10.5C8 9.67157 8.67157 9 9.5 9C10.3284 9 11 9.67157 11 10.5C11 11.3284 10.3284 12 9.5 12C8.67157 12 8 11.3284 8 10.5Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
            Filters
          </Button>
        </div>
      </div>

      {/* Expanded filter menu */}
      {isFilterMenuOpen && (
        <div className="bg-card rounded-lg p-4 mb-4 border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dietary Preferences */}
            <div className="space-y-3">
              <h3 className="font-medium">Dietary Preferences</h3>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="vegetarian"
                  checked={filters.vegetarian}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, vegetarian: checked === true })
                  }
                />
                <Label htmlFor="vegetarian" className="flex items-center gap-1">
                  <Leaf size={16} className="text-green-500" />
                  Vegetarian
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="spicy"
                  checked={filters.spicy}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, spicy: checked === true })
                  }
                />
                <Label htmlFor="spicy" className="flex items-center gap-1">
                  <Flame size={16} className="text-red-500" />
                  Spicy
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="favoritesOnly"
                  checked={filters.favoritesOnly}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, favoritesOnly: checked === true })
                  }
                />
                <Label htmlFor="favoritesOnly" className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500" />
                  Favorites Only
                </Label>
              </div>
            </div>

            {/* Food type filters */}
            <div className="space-y-3">
              <h3 className="font-medium">Food Types</h3>
              <div className="space-y-2">
                <Label htmlFor="foodType">Food Consistency</Label>
                <select
                  id="foodType"
                  value={filters.foodType}
                  onChange={(e) =>
                    setFilters({ ...filters, foodType: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="all">All Foods</option>
                  <option value="dry">Dry Food</option>
                  <option value="liquid">Liquid Food (Soups, Curries)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="includesDrinks">Includes Drinks</Label>
                <Checkbox
                  id="includesDrinks"
                  checked={filters.includesDrinks}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, includesDrinks: checked === true })
                  }
                />
              </div>
            </div>

            {/* Price and sort filters */}
            <div className="space-y-3">
              <h3 className="font-medium">Price & Sorting</h3>
              <div className="space-y-2">
                <Label htmlFor="priceRange">Price Range</Label>
                <select
                  id="priceRange"
                  value={filters.priceRange}
                  onChange={(e) =>
                    setFilters({ ...filters, priceRange: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="all">All Prices</option>
                  <option value="budget">Budget (Under $10)</option>
                  <option value="mid">Mid-Range ($10-$15)</option>
                  <option value="premium">Premium ($15+)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortBy">Sort By</Label>
                <select
                  id="sortBy"
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="default">Default</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter actions */}
          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  vegetarian: false,
                  spicy: false,
                  favoritesOnly: false,
                  foodType: "all",
                  includesDrinks: false,
                  priceRange: "all",
                  sortBy: "default",
                })
              }
            >
              Reset Filters
            </Button>
            <Button onClick={() => setIsFilterMenuOpen(false)}>Apply</Button>
          </div>
        </div>
      )}

      {/* Active filters display */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.vegetarian && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Leaf size={14} className="text-green-500" />
            Vegetarian
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 p-0"
              onClick={() => setFilters({ ...filters, vegetarian: false })}
            >
              <X size={12} />
            </Button>
          </Badge>
        )}
        {filters.spicy && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Flame size={14} className="text-red-500" />
            Spicy
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 p-0"
              onClick={() => setFilters({ ...filters, spicy: false })}
            >
              <X size={12} />
            </Button>
          </Badge>
        )}
        {filters.favoritesOnly && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star size={14} className="text-yellow-500" />
            Favorites Only
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 p-0"
              onClick={() => setFilters({ ...filters, favoritesOnly: false })}
            >
              <X size={12} />
            </Button>
          </Badge>
        )}
        {filters.foodType !== "all" && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Food Type: {filters.foodType}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 p-0"
              onClick={() => setFilters({ ...filters, foodType: "all" })}
            >
              <X size={12} />
            </Button>
          </Badge>
        )}
        {filters.priceRange !== "all" && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Price Range: {filters.priceRange}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 p-0"
              onClick={() => setFilters({ ...filters, priceRange: "all" })}
            >
              <X size={12} />
            </Button>
          </Badge>
        )}
        {filters.sortBy !== "default" && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Sort By: {filters.sortBy}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 p-0"
              onClick={() => setFilters({ ...filters, sortBy: "default" })}
            >
              <X size={12} />
            </Button>
          </Badge>
        )}
      </div>
    </>
  );
}