const { getSupabase } = require('../utils/supabase');
const { generateCaseId } = require('../utils/caseId');

class CaseModel {
  static async create(data) {
    const supabase = getSupabase();
    const caseData = {
      case_id: generateCaseId(),
      guild_id: data.guildId,
      type: data.type,
      module: data.module,
      severity: data.severity || 'medium',
      target_user_id: data.targetUserId,
      reporter_id: data.reporterId || null,
      reviewer_id: null,
      evidence_content: data.evidence?.content || null,
      evidence_attachments: data.evidence?.attachments || [],
      confidence_score: data.evidence?.confidenceScore || 0,
      status: data.status || 'pending',
      punishment: data.punishment || 'none',
      rejection_reason: null,
      resolved_at: null,
    };

    const { data: inserted, error } = await supabase
      .from('cases')
      .insert([caseData])
      .select()
      .single();

    if (error) throw error;
    return this.formatFromSupabase(inserted);
  }

  static async findOne(query) {
    const supabase = getSupabase();
    
    if (query.caseId) {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('case_id', query.caseId)
        .single();
      
      if (error || !data) return null;
      return this.formatFromSupabase(data);
    }
    
    return null;
  }

  static async find(query) {
    const supabase = getSupabase();
    let queryBuilder = supabase.from('cases').select('*');
    
    if (query.guildId) {
      queryBuilder = queryBuilder.eq('guild_id', query.guildId);
    }
    
    if (query.targetUserId) {
      queryBuilder = queryBuilder.eq('target_user_id', query.targetUserId);
    }
    
    if (query.status) {
      queryBuilder = queryBuilder.eq('status', query.status);
    }
    
    const { data, error } = await queryBuilder.order('created_at', { ascending: false });
    
    if (error) return [];
    return data.map(c => this.formatFromSupabase(c));
  }

  static async findOneAndUpdate(query, update) {
    const supabase = getSupabase();
    
    if (query.caseId) {
      const updateData = {
        ...(update.status && { status: update.status }),
        ...(update.reviewerId && { reviewer_id: update.reviewerId }),
        ...(update.punishment && { punishment: update.punishment }),
        ...(update.rejectionReason && { rejection_reason: update.rejectionReason }),
        ...(update.resolvedAt && { resolved_at: update.resolvedAt }),
      };

      const { data: updated, error } = await supabase
        .from('cases')
        .update(updateData)
        .eq('case_id', query.caseId)
        .select()
        .single();
      
      if (error) throw error;
      return this.formatFromSupabase(updated);
    }
    
    return null;
  }

  static formatFromSupabase(data) {
    return {
      _id: data.id,
      caseId: data.case_id,
      guildId: data.guild_id,
      type: data.type,
      module: data.module,
      severity: data.severity,
      targetUserId: data.target_user_id,
      reporterId: data.reporter_id,
      reviewerId: data.reviewer_id,
      evidence: {
        content: data.evidence_content,
        attachments: data.evidence_attachments || [],
        confidenceScore: data.confidence_score,
      },
      status: data.status,
      punishment: data.punishment,
      rejectionReason: data.rejection_reason,
      resolvedAt: data.resolved_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

module.exports = CaseModel;