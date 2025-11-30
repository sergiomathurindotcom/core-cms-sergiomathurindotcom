/**
 * Project lifecycle hooks
 */

export default {
  async afterCreate(event) {
    const { result } = event;

    // If project is linked to an idea, create a snapshot
    if (result.sourceIdea) {
      await createIdeaSnapshot(result.sourceIdea, 'auto', `Project "${result.title}" created`);
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;

    // Check if sourceIdea was just linked
    if (result.sourceIdea && params.data.sourceIdea) {
      const previousIdea = params.data.sourceIdea;

      // Only create snapshot if this is a new link (not just an update)
      if (previousIdea !== result.sourceIdea) {
        await createIdeaSnapshot(result.sourceIdea, 'auto', `Project "${result.title}" linked`);
      }
    }
  },
};

async function createIdeaSnapshot(ideaId: number, triggerType: 'auto' | 'manual', triggerSource: string) {
  try {
    // Fetch the full idea data
    const idea = await strapi.entityService.findOne('api::idea.idea', ideaId, {
      populate: '*',
    });

    if (!idea) return;

    // Create the snapshot
    await strapi.entityService.create('api::idea-snapshot.idea-snapshot', {
      data: {
        idea: ideaId,
        snapshotDate: new Date(),
        title: idea.title as string,
        description: idea.description as string,
        status: idea.status as string,
        priority: idea.priority as string,
        tags: idea.tags,
        triggerType,
        triggerSource,
        snapshotData: JSON.stringify(idea),
        publishedAt: new Date(),
      },
    });
  } catch (error) {
    strapi.log.error('Failed to create idea snapshot:', error);
  }
}
