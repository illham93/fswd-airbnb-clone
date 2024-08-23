module Api
  class PropertiesController < ApplicationController
    def index
      @properties = Property.order(created_at: :desc).page(params[:page]).per(6)
      return render json: { error: 'not_found' }, status: :not_found if !@properties

      render 'api/properties/index', status: :ok
    end

    def show
      @property = Property.find_by(id: params[:id])
      return render json: { error: 'not_found' }, status: :not_found if !@property

      render 'api/properties/show', status: :ok
    end

    before_action :authenticate_api_user

    def update
      @property = Property.find(params[:id])

      if @property.user != current_user
        redirect_to root_path, alert: 'You are not authorized to update this property.'
        return
      end

      if @property.update(property_params)
        render json: {notice: 'Property was successfully updated.'}
      else
        render json: {error: 'Failed to update property'}, status: :unprocessable_entity
      end
    end

    def destroy
      @property = Property.find(params[:id])

      if @property.user != current_user
        render json: {error: 'You are not authorized to delete this property.'}, status: :forbidden
        return
      end

      if @property.destroy
        render json: {notice: 'Property was successfully deleted.'}
      else
        render json: {error: 'Failed to delete property.'}, status: :unprocessable_entity
      end
    end

    def user_properties
      if @authenticated
        @properties = current_user.properties.order(created_at: :desc).page(params[:page]).per(6)
        render 'api/properties/index', status: :ok
      else
        render json: {error: 'User not authenticated' }, status: :unauthorized
      end
    end

    private

    def property_params
      params.require(:property).permit(:title, :description, :city, :country, :property_type, :max_guests, :bedrooms, :beds, :baths, :image_url)
    end

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
      @user
    end
  end
end
