const { getSupabase } = require('../utils/supabase');
const { generateCaseId } = require('../utils/caseId');

class MediaCaseModel {
  static async create(data) {
    const supabase = getSupabase();
    const mediaData = {
      case_id: generateCaseId(),
      guild_id: data.guildId,
      uploader_id: data.uploaderId,
      attachments: data.attachments || [],
      security_level_at_upload: data.securityLevelAtUpload,
      status: data.status || 'pending',
      reviewer_id: null,
      rejection_reason: null,
      relayed_message_id: null,
    };

    const { data: inserted, error } = await supabase
      .from('media_cases')
      .insert([mediaData])
      .select()
      .single();
    
    if (error) throw error;
    return this.formatFromSupabase(inserted);
  }

  static async findOne(query) {
    const supabase = getSupabase();
    
    if (query.caseId) {
      const { data, error } = await supabase
        .from('media_cases')
        .select('*')
        .eq('case_id', query.caseId)
        .single();
      
      if (error || !data) return null;
      return this.formatFromSupabase(data);
    }
    
    return null;
  }

  static formatFromSupabase(data) {
    return {
      _id: data.id,
      caseId: data.case_id,
      guildId: data.guild_id,
      uploaderId: data.uploader_id,
      attachments: data.attachments || [],
      securityLevelAtUpload: data.security_level_at_upload,
      status: data.status,
      reviewerId: data.reviewer_id,
      rejectionReason: data.rejection_reason,
      relayedMessageId: data.relayed_message_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

module.exports = MediaCaseModel;