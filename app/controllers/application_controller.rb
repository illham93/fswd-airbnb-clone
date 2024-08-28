class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  helper_method :current_user

  private

  def authenticate_api_user
    token = cookies.signed[:airbnb_session_token]
    session = Session.find_by(token: token)

    if session
      @user = session.user
      @authenticated = true
    else
      @authenticated = false
    end
  end

  def current_user
    token = cookies.signed[:airbnb_session_token]
    session = Session.find_by(token: token)
    @current_user ||= session&.user
  end
end
