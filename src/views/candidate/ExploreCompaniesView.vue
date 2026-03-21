<template>
  <AppShell>
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-foreground">Explore Companies</h1>
          <p class="text-muted-foreground text-sm mt-1">Discover companies and follow them to stay updated with job opportunities.</p>
        </div>
        <div class="flex items-center text-sm text-muted-foreground">
          <Building2 class="mr-2 h-4 w-4" />
          {{ companyStore.companies.length }} Companies Found
        </div>
      </div>

      <div class="flex gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, industry or culture tags..."
            class="pl-10 h-11"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          />
        </div>
        <Button size="lg" @click="handleSearch" class="h-11 px-8">Search</Button>
      </div>

      <div v-if="companyStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card v-for="i in 6" :key="i" class="flex flex-col border-border/50">
          <CardHeader class="flex flex-row items-center gap-4 border-b">
            <Skeleton class="h-12 w-12 rounded-lg" />
            <div class="space-y-2">
              <Skeleton class="h-4 w-24" />
              <Skeleton class="h-4 w-16" />
            </div>
          </CardHeader>
          <CardContent class="py-6 flex-1">
            <Skeleton class="h-4 w-full mb-2" />
            <Skeleton class="h-4 w-2/3" />
          </CardContent>
          <CardFooter class="border-t bg-muted/30 py-4 flex justify-between">
            <Skeleton class="h-4 w-20" />
            <Skeleton class="h-8 w-24" />
          </CardFooter>
        </Card>
      </div>

      <div v-else-if="companyStore.companies.length === 0" class="text-center py-20 border-2 border-dashed rounded-xl border-border">
        <div class="h-20 w-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
          <Building2 class="h-10 w-10 text-muted-foreground/30" />
        </div>
        <h3 class="text-lg font-semibold text-foreground">No companies found</h3>
        <p class="text-muted-foreground">Try a different search or check back later.</p>
        <Button variant="link" @click="clearSearch" class="mt-2 text-primary">Clear search</Button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          v-for="company in companyStore.companies"
          :key="company.id"
          class="flex flex-col group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/40 cursor-pointer relative"
          @click="router.push({ name: 'candidate-company-detail', params: { id: company.id } })"
        >
          <CardHeader class="flex flex-row items-start justify-between space-y-0 border-b pb-4 shrink-0">
            <div class="flex items-center gap-4">
              <Avatar class="h-12 w-12 rounded-lg border group-hover:border-primary/30 transition-colors">
                <AvatarImage :src="company.logoUrl" :alt="company.companyName" />
                <AvatarFallback class="rounded-lg bg-primary/5 text-primary">{{ company.companyName.charAt(0) }}</AvatarFallback>
              </Avatar>
              <div class="space-y-0.5 max-w-[140px]">
                <CardTitle class="text-lg truncate group-hover:text-primary transition-colors">{{ company.companyName }}</CardTitle>
                <div class="flex items-center text-xs text-muted-foreground">
                  <MapPin class="mr-1 h-3 w-3 text-primary/60 shrink-0" />
                  <span class="truncate">{{ company.location }}</span>
                </div>
              </div>
            </div>
            <Badge variant="outline" class="bg-primary/5 text-primary border-primary/10 shrink-0">{{ company.industry }}</Badge>
          </CardHeader>
          <CardContent class="flex-1 space-y-4 py-6">
            <p class="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {{ company.background }}
            </p>
            <div class="flex flex-wrap gap-1.5 min-h-[50px] content-start">
              <Badge
                v-for="tag in company.cultureTags"
                :key="tag"
                variant="secondary"
                class="text-[10px] uppercase font-bold tracking-tight h-5 px-1.5 bg-secondary/50 group-hover:bg-secondary transition-colors"
                @click.stop="handleSearchWithTag(tag)"
              >
                {{ tag }}
              </Badge>
            </div>
          </CardContent>
          <CardFooter class="border-t bg-muted/30 flex justify-between items-center py-4" @click.stop>
            <div class="flex items-center text-sm font-medium">
              <Users class="mr-1.5 h-4 w-4 text-primary" />
              {{ company.followersCount || 0 }} <span class="ml-1 text-muted-foreground font-normal">Followers</span>
            </div>
            <Button 
              :variant="company.followedByMe ? 'secondary' : 'default'" 
              size="sm" 
              class="gap-2 min-w-[100px] shadow-sm transform active:scale-95 transition-all h-8 font-semibold"
              @click.stop="toggleFollow(company)"
            >
              <template v-if="company.followedByMe">
                <CheckCircle2 class="h-4 w-4 text-primary" />
                <span class="text-primary">Following</span>
              </template>
              <template v-else>
                <UserPlus class="h-4 w-4" />
                Follow
              </template>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Search, MapPin, Users, UserPlus, CheckCircle2, Building2 } from "lucide-vue-next";
import { useCompanyStore } from "@/stores/company";
import AppShell from "@/components/layout/AppShell.vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "vue-sonner";

const companyStore = useCompanyStore();
const router = useRouter();
const searchQuery = ref("");

onMounted(() => {
  companyStore.fetchAllCompanies();
});

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    companyStore.search(searchQuery.value);
  } else {
    companyStore.fetchAllCompanies();
  }
};

const handleSearchWithTag = (tag: string) => {
  searchQuery.value = tag;
  companyStore.search(tag);
};

const clearSearch = () => {
  searchQuery.value = "";
  companyStore.fetchAllCompanies();
};

const toggleFollow = async (company: any) => {
  const originalStatus = company.followedByMe;
  const originalCount = company.followersCount;

  // Optimistic UI update
  company.followedByMe = !originalStatus;
  company.followersCount += originalStatus ? -1 : 1;

  try {
    if (originalStatus) {
      await companyStore.unfollow(company.id);
      toast.success(`No longer following ${company.companyName}`);
    } else {
      await companyStore.follow(company.id);
      toast.success(`Now following ${company.companyName}`);
    }
  } catch (error) {
    // Revert on error
    company.followedByMe = originalStatus;
    company.followersCount = originalCount;
    toast.error("Could not update follow status");
  }
};
</script>
