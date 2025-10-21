import api from '@/lib/client/api';
import {AdPlacementProps, AdPlan} from '@/types/ad-types';

class FeedService {
  async getHomePostFeeds(
    page = 1,
    limit = 10,
    activeTab?: string,
    search?: string,
    pattern: string = '4, 9, 15',
    adPlan: AdPlan = 'enterprise',
    mode: string = 'pattern',
    placement: AdPlacementProps = 'homepage_feed',
  ) {
    const params: any = {page, limit, mode, placement};
    if (search) params.search = search;
    if (pattern) params.pattern = pattern;
    if (adPlan) params.adPlan = adPlan;
    if (activeTab) params.activeTab = activeTab;

    const response = await api.get(`/feeds`, {params});
    return response.data?.data;
  }

  async getSectionPostFeeds(
    page = 1,
    limit = 10,
    section: string,
    pattern: string = '',
    adPlan: AdPlan = 'enterprise',
    mode: string = 'random',
    placement: AdPlacementProps = 'section_feed',
  ) {
    const params: any = {page, limit, section, mode, placement};

    if (pattern) params.pattern = pattern;
    if (adPlan) params.adPlan = adPlan;

    const response = await api.get(`/feeds`, {params});
    return response.data?.data;
  }

  async getUserBookmarkedPostFeeds(
    page = 1,
    limit = 10,
    onlyBookmarked: boolean = true,
    pattern: string = '',
    mode: string = 'random',
    placement: AdPlacementProps = 'homepage_feed',
  ) {
    const params: any = {page, limit, onlyBookmarked, mode, placement};

    if (pattern) params.pattern = pattern;

    const response = await api.get(`/feeds`, {params});
    return response.data?.data;
  }

  async getExplorePostFeeds(
    page = 1,
    limit = 10,
    activeTab?: string,
    search?: string,
    pattern: string = '4, 9, 15',
    mode: string = 'pattern',
    placement: AdPlacementProps = 'homepage_feed',
  ) {
    const params: any = {page, limit, mode, placement};
    if (search) params.search = search;
    if (pattern) params.pattern = pattern;
    if (activeTab) params.activeTab = activeTab;

    const response = await api.get(`/feeds/explore`, {params});
    return response.data?.data;
  }
}

export const feedService = new FeedService();
