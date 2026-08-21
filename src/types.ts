/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PageMetadata {
  title: string;
  description: string;
}

export interface RouteInfo {
  path: string;
  label: string;
  meta: PageMetadata;
  category?: 'main' | 'services' | 'industries' | 'resources' | 'other';
}

export interface SuccessStory {
  id: string;
  title: string;
  client: string;
  industry: string;
  metrics: string;
  description: string;
  challenge: string;
  solution: string;
  image: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  iconName: string;
  bullets?: string[];
  link?: string;
}

export interface PositionItem {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  published?: boolean;
  createdAt?: any;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface MarketingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Webinar' | 'Exhibition' | 'Conference' | 'Seminar';
  description: string;
}
