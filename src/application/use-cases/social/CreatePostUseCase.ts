import { ISocialRepository, CreatePostData } from '@domain/repositories/ISocialRepository'
import { SocialPost } from '@domain/entities/Social'

export class CreatePostUseCase {
  constructor(private socialRepository: ISocialRepository) {}

  async execute(data: CreatePostData): Promise<SocialPost> {
    // Validate post data
    if (data.images.length === 0) {
      throw new Error('At least one image is required')
    }

    if (data.images.length > 10) {
      throw new Error('Maximum 10 images allowed per post')
    }

    if (data.caption.length > 2200) {
      throw new Error('Caption must be less than 2200 characters')
    }

    return await this.socialRepository.createPost(data)
  }
}
