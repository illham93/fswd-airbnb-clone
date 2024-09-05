module Api
  class BookingsController < ApplicationController

    before_action :authenticate_api_user, only: [:index, :destroy]
    def index
      @bookings = current_user.bookings
                  .joins(property: :user)
                  .select('bookings.*, properties.title as property_title, properties.city as property_city, properties.price_per_night as price_per_night, users.username as owner_name')
                  .where(cancelled: :false)
      render json: {
        bookings: @bookings.map { |booking|
          {
            id: booking.id,
            start_date: booking.start_date,
            end_date: booking.end_date,
            property_title: booking.property_title,
            owner_name: booking.owner_name,
            property_id: booking.property_id,
            property_city: booking.property_city,
            image_url: url_for(booking.property.image),
            price_per_night: booking.price_per_night
          }
        }
      }
    end

    def create
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { error: 'user not logged in' }, status: :unauthorized if !session # rubocop:disable Style/NegatedIf

      property = Property.find_by(id: params[:booking][:property_id])
      return render json: { error: 'cannot find property' }, status: :not_found if !property # rubocop:disable Style/NegatedIf

      begin
        @booking = Booking.create({ 
          user_id: session.user.id,
          property_id: property.id,
          start_date: params[:booking][:start_date],
          end_date: params[:booking][:end_date]
        })
        render 'api/bookings/create', status: :created
      rescue ArgumentError => e
        render json: {error: e.message}, status: :bad_request
      end
    end

    def destroy
      @booking = Booking.find(params[:id])
      if @booking.update(cancelled: true)
        render json: {notice: 'Booking was successfully cancelled.'}
      else
        render json: {error: 'Failed to cancel booking'}, status: :unprocessable_entity
      end
    end

    def get_property_bookings
      property = Property.find_by(id: params[:id])
      return render json: {error: 'cannot find property'}, status: :not_found if !property # rubocop:disable Style/NegatedIf

      @bookings = property.bookings
                          .where('end_date > ?', Date.today)
                          .where(cancelled: false)
                          
      render 'api/bookings/index'
    end

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

    def booking_params
      params.require(:bookoing).permit(:property_id, :start_date, :end_date)
    end
  end
end