import React, { useState, useEffect, useRef } from 'react';
import { Send, Edit2, Trash2, X, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { commentService } from '../../services/commentService';
import type { Comment, CreateCommentData, UpdateCommentData } from '../../types';
import './MovieComments.scss';

/**
 * MovieComments props
 * @interface MovieCommentsProps
 */
interface MovieCommentsProps {
  movieId: string;
  movieTitle: string;
}

/**
 * MovieComments component
 * Renders and manages comments for a specific movie: create, edit, delete and list
 * with pagination. Only authenticated users can create comments and only the author
 * can edit or delete their own comments.
 *
 * @component
 * @param {MovieCommentsProps} props - Component props
 * @returns {JSX.Element} Rendered comments UI
 *
 * @example
 * ```tsx
 * <MovieComments 
 *   movieId="68fe48a20c733d2362a813ed" 
 *   movieTitle="Avatar - Fuego y Ceniza" 
 * />
 * ```
 */
const MovieComments: React.FC<MovieCommentsProps> = ({ movieId, movieTitle }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalComments, setTotalComments] = useState(0);
  const [userCache, setUserCache] = useState<Record<string, any>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    loadComments();
  }, [movieId, currentPage]);

  useEffect(() => {
    if (currentPage === 1 && comments && comments.length > 0) {
      const commentsContainer = document.querySelector('.movie-comments__list');
      if (commentsContainer) {
        commentsContainer.scrollTop = 0;
      }
    }
  }, [comments, currentPage]);

  useEffect(() => {
    if (showDeleteModal) {
      setTimeout(() => {
        if (firstFocusableRef.current) {
          firstFocusableRef.current.focus();
        }
      }, 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          cancelDeleteComment();
          return;
        }

        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as NodeListOf<HTMLElement>;

          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [showDeleteModal]);


  /**
   * Load comments from server with pagination, updating local state
   * @async
   */
  const loadComments = async () => {
    if (!movieId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await commentService.getCommentsByMovie(movieId, currentPage, 10);
      
      if (response.success && response.data) {
        const commentsArray = Array.isArray(response.data) ? response.data : (response.data?.comments || []);
        const pagination = (response as any).pagination || {};
        
        if (currentPage === 1) {
          setComments(commentsArray);
        } else {
          setComments(prev => [...(prev || []), ...commentsArray]);
        }
        setTotalComments(pagination.totalComments || commentsArray.length);
        setHasMore(pagination.hasNextPage || false);
      } else {
        setError(response.message || 'Error al cargar comentarios');
      }
    } catch (err) {
      setError('Error de conexión al cargar comentarios');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submit a new comment. Validates auth, emptiness and length.
   * @async
   */
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para comentar');
      return;
    }
    
    if (!newComment.trim()) {
      setError('El comentario no puede estar vacío');
      return;
    }
    
    if (newComment.length > 200) {
      setError('El comentario no puede exceder 200 caracteres');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const commentData: CreateCommentData = {
        movieId,
        content: newComment.trim()
      };
      
      const response = await commentService.createComment(commentData);
      
      if (response.success && response.data) {
        setComments(prev => [response.data!, ...(prev || [])]);
        setNewComment('');
        setTotalComments(prev => prev + 1);
      } else {
        setError(response.message || 'Error al crear comentario');
      }
    } catch (err) {
      setError('Error de conexión al crear comentario');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Start editing mode for a given comment
   */
  const handleEditComment = (comment: Comment) => {
    const id = (comment as any)?._id || (comment as any)?.id;
    setEditingComment(id);
    setEditContent(comment.content);
  };

  /**
   * Cancel edit mode and clear edit buffer
   */
  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  /**
   * Update comment content after validation
   * @async
   */
  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) {
      setError('El comentario no puede estar vacío');
      return;
    }
    
    if (editContent.length > 200) {
      setError('El comentario no puede exceder 200 caracteres');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const updateData: UpdateCommentData = {
        content: editContent.trim()
      };
      
      const response = await commentService.updateComment(commentId, updateData);
      
      if (response.success && response.data) {
        setComments(prev => 
          (prev || []).map(comment => {
            const cid = (comment as any)?._id || (comment as any)?.id;
            return cid === commentId ? (response.data as any) : comment;
          })
        );
        setEditingComment(null);
        setEditContent('');
      } else {
        setError(response.message || 'Error al actualizar comentario');
      }
    } catch (err) {
      setError('Error de conexión al actualizar comentario');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Open confirmation modal to delete a comment
   */
  const handleDeleteComment = async (commentId: string) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  /**
   * Confirm deletion and remove comment
   * @async
   */
  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await commentService.deleteComment(commentToDelete);
      
      if (response.success) {
        setComments(prev => (prev || []).filter((comment) => {
          const cid = (comment as any)?._id || (comment as any)?.id;
          return String(cid) !== String(commentToDelete);
        }));
        setTotalComments(prev => prev - 1);
        setShowDeleteModal(false);
        setCommentToDelete(null);
      } else {
        setError(response.message || 'Error al eliminar comentario');
      }
    } catch (err) {
      setError('Error de conexión al eliminar comentario');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Cancel deletion and close modal
   */
  const cancelDeleteComment = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  /**
   * Load more comments by increasing current page
   */
  const loadMoreComments = () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  /**
   * Get user info from cache/context/object for a given userId
   */
  const getUserInfo = (userId: any) => {
    if (!userId) {
      return { _id: 'unknown', firstName: 'Usuario', lastName: '', username: 'Usuario' };
    }

    let actualUserId: string = '';
    let userData: any = {};
    
    if (userId && typeof userId === 'object') {
      actualUserId = (userId as any)._id || (userId as any).id || '';
      userData = userId;
    } else {
      actualUserId = String(userId);
    }
    
    if (actualUserId && userCache[actualUserId]) {
      return userCache[actualUserId];
    }
    
    if (user && actualUserId && String(user._id) === String(actualUserId)) {
      const userInfo = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
      };
      setUserCache(prev => ({ ...prev, [actualUserId]: userInfo }));
      return userInfo;
    }
    
    if (userData && typeof userData === 'object' && Object.keys(userData).length > 0) {
      const userInfo = {
        _id: actualUserId || 'unknown',
        firstName: userData.firstName || 'Usuario',
        lastName: userData.lastName || '',
        username: userData.username || (userData.firstName ? (userData.firstName + (userData.lastName || '')) : 'Usuario')
      };
      if (actualUserId) {
        setUserCache(prev => ({ ...prev, [actualUserId]: userInfo }));
      }
      return userInfo;
    }
    
    return {
      _id: actualUserId || 'unknown',
      firstName: 'Usuario',
      lastName: '',
      username: 'Usuario'
    };
  };

  /**
   * Format date into Spanish-readable string (relative for recent, absolute otherwise)
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  
  const canEditComment = (comment: Comment) => {
    if (!isAuthenticated || !user) return false;
    

    let currentUserId: string | null = user._id ? String(user._id) : null;
    
    if (!currentUserId) {
      const token = localStorage.getItem('token') || localStorage.getItem('unyfilm-token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          currentUserId = payload?.userId || payload?.id || payload?._id || null;
          currentUserId = currentUserId ? String(currentUserId) : null;
        } catch (error) {
          currentUserId = null;
        }
      }
    }
    
    if (!currentUserId) return false;
    
    const rawUserId: any = (comment as any)?.userId ?? null;
    let authorId: string | null = null;
    if (rawUserId && typeof rawUserId === 'object') {
      authorId = rawUserId._id || rawUserId.id || null;
    } else if (rawUserId) {
      authorId = String(rawUserId);
    }
    if (!authorId) return false;
    
    return String(authorId) === String(currentUserId);
  };

  return (
    <section className="movie-comments" aria-labelledby="comments-heading">
      <div className="movie-comments__header">
        <h3 id="comments-heading" className="movie-comments__title">
          Comentarios ({totalComments})
        </h3>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="movie-comments__form" role="form" aria-label="Formulario de comentarios">
          <div className="movie-comments__input-group">
            <label htmlFor="comment-textarea" className="sr-only">
              Escribir comentario sobre {movieTitle}
            </label>
            <textarea
              id="comment-textarea"
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`Comenta sobre ${movieTitle}...`}
              className="movie-comments__textarea"
              maxLength={200}
              rows={3}
              disabled={submitting}
              tabIndex={0}
              aria-label={`Escribir comentario sobre ${movieTitle}`}
              aria-describedby="char-count"
              aria-invalid={newComment.length > 200 ? 'true' : 'false'}
            />
            <div id="char-count" className="movie-comments__char-count" aria-live="polite">
              {newComment.length}/200 caracteres
            </div>
          </div>
          <button
            type="submit"
            disabled={!newComment.trim() || submitting || newComment.length > 200}
            className="movie-comments__submit-btn"
            tabIndex={0}
            aria-label="Enviar comentario"
          >
            {submitting ? (
              <div className="movie-comments__spinner" />
            ) : (
              <>
                <Send size={16} />
                Comentar
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="movie-comments__login-prompt">
          <p>Inicia sesión para comentar sobre esta película</p>
        </div>
      )}

      {error && (
        <div className="movie-comments__error" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      <div className="movie-comments__list" role="list" aria-label="Lista de comentarios">
        {loading && (!comments || comments.length === 0) ? (
          <div className="movie-comments__loading" role="status" aria-live="polite">
            <div className="movie-comments__loading-container">
              <div className="movie-comments__loading-spinner" aria-hidden="true">
                <div className="movie-comments__loading-dot"></div>
                <div className="movie-comments__loading-dot"></div>
                <div className="movie-comments__loading-dot"></div>
              </div>
              <p className="movie-comments__loading-text">Cargando comentarios...</p>
            </div>
          </div>
        ) : !comments || comments.length === 0 ? (
          <div className="movie-comments__empty" role="status">
            <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
          </div>
        ) : (
          <>
            {(comments || []).map((comment, index) => {
              const userInfo = getUserInfo((comment as any)?.userId ?? null);
              const commentId = (comment as any)?._id || (comment as any)?.id;
              const stableKey = commentId || `${index}-${userInfo?._id || 'comment'}`;
              
              return (
              <article key={stableKey} className="movie-comments__comment" role="listitem" aria-labelledby={`comment-${commentId || index}-author`}>
                <div className="movie-comments__comment-header">
                  <div className="movie-comments__user-info">
                     <div className="movie-comments__user-avatar" aria-hidden="true">
                       {userInfo.firstName?.charAt(0)?.toUpperCase() || 'E'}
                     </div>
                     <div className="movie-comments__user-details">
                       <span id={`comment-${commentId || index}-author`} className="movie-comments__user-name">
                         {userInfo.firstName}{userInfo.lastName}
                       </span>
                     <time className="movie-comments__comment-date" dateTime={comment.createdAt}>
                        {formatDate(comment.createdAt)}
                        {comment.updatedAt !== comment.createdAt && ' (editado)'}
                      </time>
                    </div>
                  </div>
                  
                  {canEditComment(comment) && (
                    <div className="movie-comments__comment-actions" role="group" aria-label={`Acciones para el comentario de ${userInfo.firstName}`}>
                      {editingComment === commentId ? (
                        <>
                          <button
                            onClick={() => handleUpdateComment(String(commentId))}
                            disabled={submitting}
                            className="movie-comments__action-btn movie-comments__action-btn--save"
                            title="Guardar cambios"
                            tabIndex={0}
                            aria-label="Guardar cambios del comentario"
                          >
                            <Check size={18} aria-hidden="true" />
                            <span className="sr-only">Guardar cambios</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={submitting}
                            className="movie-comments__action-btn movie-comments__action-btn--cancel"
                            title="Cancelar edición"
                            tabIndex={0}
                            aria-label="Cancelar edición del comentario"
                          >
                            <X size={18} aria-hidden="true" />
                            <span className="sr-only">Cancelar edición</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditComment(comment)}
                            disabled={submitting}
                            className="movie-comments__action-btn movie-comments__action-btn--edit"
                            title="Editar comentario"
                            tabIndex={0}
                            aria-label="Editar comentario"
                          >
                            <Edit2 size={18} aria-hidden="true" />
                            <span className="sr-only">Editar comentario</span>
                          </button>
                          <button
                            onClick={() => handleDeleteComment(String(commentId))}
                            disabled={submitting}
                            className="movie-comments__action-btn movie-comments__action-btn--delete"
                            title="Eliminar comentario"
                            tabIndex={0}
                            aria-label="Eliminar comentario"
                          >
                            <Trash2 size={18} aria-hidden="true" />
                            <span className="sr-only">Eliminar comentario</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="movie-comments__comment-content">
                  {editingComment === commentId ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="movie-comments__edit-textarea"
                      maxLength={200}
                      rows={3}
                      disabled={submitting}
                      tabIndex={0}
                      aria-label="Editar comentario"
                      aria-describedby={`char-count-edit-${commentId}`}
                    />
                  ) : (
                    <p className="movie-comments__comment-text" id={`comment-${commentId}-content`}>
                      {comment.content}
                    </p>
                  )}
                </div>
              </article>
              );
            })}
            
            {hasMore && (
              <button
                onClick={loadMoreComments}
                disabled={loading}
                className="movie-comments__load-more"
                tabIndex={0}
                aria-label="Cargar más comentarios"
                aria-describedby="load-more-description"
              >
              {loading ? (
                <>
                  <div className="movie-comments__loading-spinner-small" aria-hidden="true">
                    <div className="movie-comments__loading-dot-small"></div>
                    <div className="movie-comments__loading-dot-small"></div>
                    <div className="movie-comments__loading-dot-small"></div>
                  </div>
                  <span aria-live="polite">Cargando más comentarios...</span>
                </>
              ) : (
                'Cargar más comentarios'
              )}
              </button>
            )}
            <div id="load-more-description" className="sr-only">
              Presiona Enter o Espacio para cargar más comentarios
            </div>
          </>
        )}
        
      </div>
      
      {showDeleteModal && (
        <div 
          className="movie-comments__modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelDeleteComment();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-message"
        >
          <div 
            ref={modalRef}
            className="movie-comments__modal"
          >
            <div className="movie-comments__modal-header">
              <h3 
                id="modal-title"
                className="movie-comments__modal-title"
              >
                Eliminar comentario
              </h3>
            </div>
            <div className="movie-comments__modal-body">
              <p 
                id="modal-message"
                className="movie-comments__modal-message"
              >
                ¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="movie-comments__modal-footer">
              <button
                ref={firstFocusableRef}
                onClick={cancelDeleteComment}
                disabled={submitting}
                className="movie-comments__modal-btn movie-comments__modal-btn--cancel"
                aria-label="Cancelar eliminación del comentario"
              >
                Cancelar
              </button>
              <button
                ref={lastFocusableRef}
                onClick={confirmDeleteComment}
                disabled={submitting}
                className="movie-comments__modal-btn movie-comments__modal-btn--confirm"
                aria-label="Confirmar eliminación del comentario"
              >
                {submitting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MovieComments;
