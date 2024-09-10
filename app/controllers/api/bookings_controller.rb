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
          property = booking.property
          if property&.image&.attached?
            image_url = url_for(property.image)
          else
            image_url = 'No_image_available.png'
          end
          {
            id: booking.id,
            start_date: booking.start_date,
            end_date: booking.end_date,
            property_title: booking.property_title,
            owner_name: booking.owner_name,
            property_id: booking.property_id,
            property_city: booking.property_city,
            image_url: image_url,
            price_per_night: booking.price_per_night
          }
        }
      }
    end

    def create
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { error: 'user not logged in' }, status: :unauthorized if !session
    
      property_id = params[:booking][:property_id]
      start_date = Date.parse(params[:booking][:start_date])
      end_date = Date.parse(params[:booking][:end_date])
      checkout_session_id = params[:booking][:checkout_session_id]

      # Find the property and check availability
      property = Property.find_by(id: property_id)
      return render json: {error: 'Property not found'}, status: :not_found unless property

      # Find the charge by checkout_session_id and ensure it is completed
      charge = Charge.find_by(checkout_session_id: checkout_session_id, complete: true, start_date: start_date, end_date: end_date, property_id: property_id)
      if charge.nil?
        return render json: { error: 'Valid charge not found for the given session' }, status: :unprocessable_entity
      end

      # create a new booking
      @booking = Booking.new({
        user_id: session.user.id,
        property_id: property_id,
        start_date: start_date,
        end_date: end_date,
        charge_id: charge.id
      })

      if @booking.save
        render 'api/bookings/create', status: :created
      else
        render json: {error: @booking.errors.full_messages}, status: :unprocessable_entity
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

    def check
      # Check if the property exists
      property = Property.find_by(id: params[:property_id])
      return render json: { error: 'Cannot find property' }, status: :not_found unless property

      # Ensure dates are parsed correctly
      start_date = Date.parse(params[:start_date]) rescue nil
      end_date = Date.parse(params[:end_date]) rescue nil

      if start_date.nil? || end_date.nil?
        return render json: { error: 'Invalid date format' }, status: :unprocessable_entity
      end

      Rails.logger.debug "Start date: #{start_date}, End date: #{end_date}"

      # Check if there are any completed charges for the given property and date range
      charge_exists = Charge.exists?(
        property_id: params[:property_id],
        start_date: start_date,
        end_date: end_date,
        complete: 1
      )

      # Check if there is a booking for the given property and date range
      booking_exists = Booking.exists?(
        property_id: params[:property_id],
        start_date: start_date,
        end_date: end_date
      )

      if charge_exists && booking_exists
        render json: { exists: true }
      else
        render json: { exists: false }
      end
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