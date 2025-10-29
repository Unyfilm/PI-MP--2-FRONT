import React, { useState, useEffect, useRef } from 'react';
import { Send, Edit2, Trash2, X, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { commentService } from '../../services/commentService';
import type { Comment, CreateCommentData, UpdateCommentData } from '../../types';
import './MovieComments.scss';

/**
 * Props para el componente MovieComments
 * @interface MovieCommentsProps
 */
interface MovieCommentsProps {
  /** ID único de la película */
  movieId: string;
  /** Título de la película para mostrar en el placeholder */
  movieTitle: string;
}

/**
 * Componente para mostrar y gestionar comentarios de una película específica.
 * Permite crear, editar, eliminar y visualizar comentarios con paginación.
 * Solo los usuarios autenticados pueden crear comentarios, y solo el autor puede editar/eliminar sus propios comentarios.
 * 
 * @component
 * @param {MovieCommentsProps} props - Las props del componente
 * @returns {JSX.Element} El componente de comentarios renderizado
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


  /**
   * Carga los comentarios de la película desde el servidor.
   * Maneja la paginación y actualiza el estado de los comentarios.
   * 
   * @async
   * @function loadComments
   * @returns {Promise<void>} No retorna valor, actualiza el estado
   * 
   * @description
   * - Si es la primera página, reemplaza todos los comentarios
   * - Si es una página posterior, agrega los comentarios a los existentes
   * - Actualiza el total de comentarios y el estado de paginación
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
   * Maneja el envío de un nuevo comentario.
   * Valida la autenticación, el contenido y la longitud del comentario.
   * 
   * @async
   * @function handleSubmitComment
   * @param {React.FormEvent} e - Evento del formulario
   * @returns {Promise<void>} No retorna valor, actualiza el estado
   * 
   * @description
   * - Verifica que el usuario esté autenticado
   * - Valida que el comentario no esté vacío
   * - Valida que no exceda 200 caracteres
   * - Crea el comentario y lo agrega al inicio de la lista
   * - Actualiza el contador total de comentarios
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
   * Inicia el modo de edición para un comentario específico.
   * 
   * @function handleEditComment
   * @param {Comment} comment - El comentario a editar
   * @returns {void}
   */
  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment._id);
    setEditContent(comment.content);
  };

  /**
   * Cancela el modo de edición y limpia el contenido editado.
   * 
   * @function handleCancelEdit
   * @returns {void}
   */
  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  /**
   * Actualiza un comentario existente con el nuevo contenido.
   * Valida el contenido y la longitud antes de enviar la actualización.
   * 
   * @async
   * @function handleUpdateComment
   * @param {string} commentId - ID del comentario a actualizar
   * @returns {Promise<void>} No retorna valor, actualiza el estado
   * 
   * @description
   * - Valida que el contenido no esté vacío
   * - Valida que no exceda 200 caracteres
   * - Actualiza el comentario en la lista local
   * - Sale del modo de edición
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
          (prev || []).map(comment => 
            comment._id === commentId ? response.data! : comment
          )
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
   * Inicia el proceso de eliminación de un comentario mostrando el modal de confirmación.
   * 
   * @function handleDeleteComment
   * @param {string} commentId - ID del comentario a eliminar
   * @returns {void}
   */
  const handleDeleteComment = async (commentId: string) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  /**
   * Confirma y ejecuta la eliminación del comentario seleccionado.
   * 
   * @async
   * @function confirmDeleteComment
   * @returns {Promise<void>} No retorna valor, actualiza el estado
   * 
   * @description
   * - Elimina el comentario del servidor
   * - Remueve el comentario de la lista local
   * - Actualiza el contador total de comentarios
   * - Cierra el modal de confirmación
   */
  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await commentService.deleteComment(commentToDelete);
      
      if (response.success) {
        setComments(prev => (prev || []).filter(comment => comment._id !== commentToDelete));
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
   * Cancela la eliminación del comentario y cierra el modal.
   * 
   * @function cancelDeleteComment
   * @returns {void}
   */
  const cancelDeleteComment = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  /**
   * Carga más comentarios incrementando la página actual.
   * Solo funciona si hay más comentarios disponibles y no está cargando.
   * 
   * @function loadMoreComments
   * @returns {void}
   */
  const loadMoreComments = () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  /**
   * Obtiene la información del usuario para un comentario específico.
   * Maneja el caché de usuarios y extrae información de objetos userId.
   * 
   * @function getUserInfo
   * @param {any} userId - ID del usuario o objeto con información del usuario
   * @returns {Object} Información del usuario con _id, firstName, lastName y username
   * 
   * @description
   * - Si userId es un objeto, extrae el ID y la información disponible
   * - Verifica el caché local antes de procesar
   * - Si es el usuario actual, usa su información del contexto
   * - Si no hay información, devuelve 'Error' como fallback
   */
  const getUserInfo = (userId: any) => {
    let actualUserId: string;
    let userData: any = {};
    
    if (typeof userId === 'object') {
      actualUserId = (userId as any)._id || (userId as any).id || '';
      userData = userId;
    } else {
      actualUserId = userId;
    }
    
    if (userCache[actualUserId]) {
      return userCache[actualUserId];
    }
    
    if (user && String(user._id) === String(actualUserId)) {
      const userInfo = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
      };
      setUserCache(prev => ({ ...prev, [actualUserId]: userInfo }));
      return userInfo;
    }
    
    if (userData && Object.keys(userData).length > 0) {
      const userInfo = {
        _id: actualUserId,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        username: userData.username || (userData.firstName + (userData.lastName || '')) || 'Error'
      };
      setUserCache(prev => ({ ...prev, [actualUserId]: userInfo }));
      return userInfo;
    }
    
    return {
      _id: actualUserId,
      firstName: 'Error',
      lastName: '',
      username: 'Error'
    };
  };

  /**
   * Formatea una fecha en un formato legible en español.
   * Muestra tiempo relativo para fechas recientes y fecha absoluta para fechas antiguas.
   * 
   * @function formatDate
   * @param {string} dateString - Fecha en formato ISO string
   * @returns {string} Fecha formateada en español
   * 
   * @description
   * - Menos de 1 hora: "Hace unos minutos"
   * - Menos de 24 horas: "Hace X hora(s)"
   * - Menos de 48 horas: "Ayer"
   * - Más de 48 horas: Fecha en formato "DD MMM YYYY"
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

  /**
   * Verifica si el usuario actual puede editar un comentario específico.
   * Solo el autor del comentario puede editarlo.
   * 
   * @function canEditComment
   * @param {Comment} comment - El comentario a verificar
   * @returns {boolean} true si el usuario puede editar el comentario, false en caso contrario
   */
  const canEditComment = (comment: Comment) => {
    if (!isAuthenticated || !user) return false;
    
    // Obtener el ID del usuario actual (prioridad: user._id, fallback: token)
    let currentUserId = user._id;
    
    // Si user._id no está disponible o es undefined, intentar con el token
    if (!currentUserId) {
      const token = localStorage.getItem('token') || localStorage.getItem('unyfilm-token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          currentUserId = payload.userId || payload.id || payload._id;
        } catch (error) {
          // Error al decodificar token, continuar sin fallback
        }
      }
    }
    
    // Si aún no tenemos un ID válido, no se puede editar
    if (!currentUserId) return false;
    
    const actualUserId = typeof comment.userId === 'object' ? (comment.userId as any)._id || (comment.userId as any).id : comment.userId;
    return String(actualUserId) === String(currentUserId);
  };

  return (
    <div className="movie-comments">
      <div className="movie-comments__header">
        <h3 className="movie-comments__title">
          Comentarios ({totalComments})
        </h3>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="movie-comments__form">
          <div className="movie-comments__input-group">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`Comenta sobre ${movieTitle}...`}
              className="movie-comments__textarea"
              maxLength={200}
              rows={3}
              disabled={submitting}
            />
            <div className="movie-comments__char-count">
              {newComment.length}/200
            </div>
          </div>
          <button
            type="submit"
            disabled={!newComment.trim() || submitting || newComment.length > 200}
            className="movie-comments__submit-btn"
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
        <div className="movie-comments__error">
          {error}
        </div>
      )}

      <div className="movie-comments__list">
        {loading && (!comments || comments.length === 0) ? (
          <div className="movie-comments__loading">
            <div className="movie-comments__loading-container">
              <div className="movie-comments__loading-spinner">
                <div className="movie-comments__loading-dot"></div>
                <div className="movie-comments__loading-dot"></div>
                <div className="movie-comments__loading-dot"></div>
              </div>
              <p className="movie-comments__loading-text">Cargando comentarios...</p>
            </div>
          </div>
        ) : !comments || comments.length === 0 ? (
          <div className="movie-comments__empty">
            <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
          </div>
        ) : (
          <>
            {(comments || []).map((comment) => {
              const userInfo = getUserInfo(comment.userId);
              
              return (
              <div key={comment._id} className="movie-comments__comment">
                <div className="movie-comments__comment-header">
                  <div className="movie-comments__user-info">
                     <div className="movie-comments__user-avatar">
                       {userInfo.firstName?.charAt(0)?.toUpperCase() || 'E'}
                     </div>
                     <div className="movie-comments__user-details">
                       <span className="movie-comments__user-name">
                         {userInfo.firstName}{userInfo.lastName}
                       </span>
                      <span className="movie-comments__comment-date">
                        {formatDate(comment.createdAt)}
                        {comment.updatedAt !== comment.createdAt && ' (editado)'}
                      </span>
                    </div>
                  </div>
                  
                  {canEditComment(comment) && (
                    <div className="movie-comments__comment-actions">
                      {editingComment === comment._id ? (
                        <>
                          <button
                            onClick={() => handleUpdateComment(comment._id)}
                            disabled={submitting}
                            className="movie-comments__action-btn movie-comments__action-btn--save"
                            title="Guardar cambios"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={submitting}
                            className="movie-comments__action-btn movie-comments__action-btn--cancel"
                            title="Cancelar edición"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditComment(comment)}
                            disabled={submitting}
                            className="movie-comments__action-btn movie-comments__action-btn--edit"
                            title="Editar comentario"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            disabled={submitting}
                            className="movie-comments__action-btn movie-comments__action-btn--delete"
                            title="Eliminar comentario"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="movie-comments__comment-content">
                  {editingComment === comment._id ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="movie-comments__edit-textarea"
                      maxLength={200}
                      rows={3}
                      disabled={submitting}
                    />
                  ) : (
                    <p className="movie-comments__comment-text">
                      {comment.content}
                    </p>
                  )}
                </div>
              </div>
              );
            })}
            
            {hasMore && (
              <button
                onClick={loadMoreComments}
                disabled={loading}
                className="movie-comments__load-more"
              >
              {loading ? (
                <>
                  <div className="movie-comments__loading-spinner-small">
                    <div className="movie-comments__loading-dot-small"></div>
                    <div className="movie-comments__loading-dot-small"></div>
                    <div className="movie-comments__loading-dot-small"></div>
                  </div>
                  Cargando más...
                </>
              ) : (
                'Cargar más comentarios'
              )}
              </button>
            )}
          </>
        )}
        
      </div>
      
      {showDeleteModal && (
        <div className="movie-comments__modal-overlay">
          <div className="movie-comments__modal">
            <div className="movie-comments__modal-header">
              <h3 className="movie-comments__modal-title">Eliminar comentario</h3>
            </div>
            <div className="movie-comments__modal-body">
              <p className="movie-comments__modal-message">
                ¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="movie-comments__modal-footer">
              <button
                onClick={cancelDeleteComment}
                disabled={submitting}
                className="movie-comments__modal-btn movie-comments__modal-btn--cancel"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteComment}
                disabled={submitting}
                className="movie-comments__modal-btn movie-comments__modal-btn--confirm"
              >
                {submitting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieComments;
