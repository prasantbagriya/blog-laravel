<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PinterestBoard extends Model
{
    use HasFactory;

    protected $table = 'pinterest_boards';

    protected $fillable = [
        'pinterest_account_id',
        'board_id',
        'name',
        'description',
        'privacy',
        'pin_count',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'pin_count' => 'integer',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(PinterestAccount::class, 'pinterest_account_id');
    }

    public function pins(): HasMany
    {
        return $this->hasMany(PinterestPinShare::class, 'pinterest_board_id');
    }

    /**
     * Mark this board as the primary/default pin board.
     */
    public function makeDefault(): void
    {
        static::where('pinterest_account_id', $this->pinterest_account_id)
            ->update(['is_default' => false]);

        $this->update(['is_default' => true]);
    }
}
