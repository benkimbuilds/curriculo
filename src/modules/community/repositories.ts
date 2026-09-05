import type {
  ContentReport,
  GalleryEntry,
  ModerationStatus,
  PeerFeedback,
} from "./types";

export interface GalleryRepository {
  findById(id: string): Promise<GalleryEntry | null>;
  updateModerationStatus(id: string, status: ModerationStatus): Promise<void>;
}

export interface PeerFeedbackRepository {
  save(feedback: PeerFeedback): Promise<void>;
  hasFeedbackFromAuthor(
    galleryEntryId: string,
    authorId: string,
  ): Promise<boolean>;
}

export interface ContentReportRepository {
  findById(id: string): Promise<ContentReport | null>;
  hasOpenReport(galleryEntryId: string, reporterId: string): Promise<boolean>;
  save(report: ContentReport): Promise<void>;
}

export interface CommunityClock {
  now(): Date;
}

export interface CommunityIdGenerator {
  nextId(): string;
}
