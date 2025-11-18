"use client";

import { SearchInput } from "@/components/form/search-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function SearchInputWithButton({ onSearch, label }: { onSearch: (query: string) => void; label: string }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-4 flex flex-col gap-1">
      <Label>{label}</Label>
      <div className="flex flex-col md:flex-row gap-2">
        <SearchInput value={searchQuery} onChange={setSearchQuery} onSearch={onSearch} placeholder="Search..." />
        <Button onClick={() => onSearch(searchQuery)}>Search</Button>
      </div>
    </div>
  );
}
