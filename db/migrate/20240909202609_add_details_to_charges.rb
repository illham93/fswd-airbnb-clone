class AddDetailsToCharges < ActiveRecord::Migration[6.1]
  def change
    add_column :charges, :property_id, :integer
    add_column :charges, :start_date, :date
    add_column :charges, :end_date, :date
  end
end
