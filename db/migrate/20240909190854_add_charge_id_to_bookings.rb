class AddChargeIdToBookings < ActiveRecord::Migration[6.1]
  def change
    add_reference :bookings, :charge, foreign_key: true
  end
end
